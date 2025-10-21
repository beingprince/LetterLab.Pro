// backend/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

import connectDB, { mongoState } from "./db.js";
import { auth } from "./middleware/auth.js";
import conversationRoutes from "./routes/conversations.js";
import usageRouter from "./routes/usage.js";
import usersRouter from "./routes/users.js";

// ───────────────────────────────────────────────────────────────────────────────
// Feature flags & config (from .env)
const ENABLE_CHAT  = process.env.ENABLE_CHAT === "1";      // 0 (off) or 1 (on)
const ENABLE_EMAIL = process.env.ENABLE_EMAIL !== "1";     // default ON

// ⭐ UPDATED: include both custom domains and Vercel preview; no trailing slashes
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "https://letterlab.pro",
  "https://www.letterlab.pro",
  "https://letter-lab-84tso78qn-beingprinces-projects.vercel.app", // your prod Vercel URL
];

// 1) Initialize app FIRST
const app = express();

// ───────────────────────────────────────────────────────────────────────────────
// 2) Security + CORS + body limits (BEFORE routes)
app.use(helmet());

// ⭐ UPDATED: robust CORS (handles preflight + Vercel previews)
app.use(
  cors({
    origin: (origin, cb) => {
      // allow server-to-server / curl / health checks
      if (!origin) return cb(null, true);

      // exact allowlist first
      if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);

      // allow any *.vercel.app preview build (useful for PR/preview deployments)
      try {
        const host = new URL(origin).hostname;
        if (host.endsWith(".vercel.app")) return cb(null, true);
      } catch (_) { /* ignore */ }

      return cb(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
    maxAge: 86400,
  })
);

// handle preflight explicitly
app.options("*", cors());

// Tighter body size limits to control cost
app.use(express.json({ limit: "16kb" }));
app.use(express.text({ type: ["text/plain", "text/*"], limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// ───────────────────────────────────────────────────────────────────────────────
// 3) Rate Limiters
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", apiLimiter);

const modelLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
});

// ───────────────────────────────────────────────────────────────────────────────
// 4) Gemini setup + helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MODEL = "gemini-2.0-flash";

function ai() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("Missing GEMINI_API_KEY");
  return new GoogleGenAI({ apiKey: key });
}

function safeStitch(response) {
  const parts =
    response?.output?.[0]?.content?.parts ||
    response?.candidates?.[0]?.content?.parts ||
    [];
  return parts.map((p) => p?.text || "").join("");
}

function sanitizeText(s, max = 4000) {
  if (typeof s !== "string") return "";
  return s.trim().slice(0, max);
}

// ───────────────────────────────────────────────────────────────────────────────
// 5) Health
app.get("/", (_req, res) => res.type("text/plain").send("LetterLab backend is running."));

app.get("/healthz", (_req, res) => {
  const { isConnected, readyState } = mongoState();
  if (isConnected) return res.json({ db: "ok", readyState });
  return res.status(503).json({ db: "down", readyState });
});

app.get("/api/health", async (_req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY;
  const payload = { ok: true, hasKey, modelPing: null, errorInfo: null };
  if (!hasKey) return res.json(payload);

  try {
    const client = ai();
    const r = await client.models.generateContent({ model: MODEL, contents: "ping" });
    const text = r?.text ?? safeStitch(r) ?? "";
    payload.modelPing = text.slice(0, 80) || "(no text)";
    res.json(payload);
  } catch (err) {
    payload.modelPing = "ERROR";
    payload.errorInfo = { message: err?.message, code: err?.code, status: err?.status };
    console.error("[/api/health]", err);
    res.json(payload);
  }
});

// ───────────────────────────────────────────────────────────────────────────────
// 6) Public auth
app.use("/api/users", usersRouter);

// ───────────────────────────────────────────────────────────────────────────────
// 7) Protected routes
app.use("/api/conversations", auth, conversationRoutes);
app.use("/api/usage", auth, usageRouter);

// ───────────────────────────────────────────────────────────────────────────────
// 8) Email generator
if (ENABLE_EMAIL) {
  app.post("/api/generate-email", modelLimiter, async (req, res) => {
    try {
      const notes = sanitizeText(req.body?.notes, 4000);
      const tone  = sanitizeText(req.body?.tone || "Professional", 40);

      if (/^\s*(hi|hello|hey)\b/i.test(notes) && notes.length < 80) {
        return res.status(400).json({
          error: "This looks like a greeting, not email notes. Use /api/chat for casual messages.",
        });
      }

      if (!notes) return res.status(400).json({ error: 'Missing "notes"' });

      const prompt = `
You are LetterLab Pro, an executive communications assistant with a professional tone: ${tone}
User notes:
"""${notes}"""
`.trim();

      const client = ai();
      const r = await client.models.generateContent({ model: MODEL, contents: prompt });
      const text = r?.text ?? safeStitch(r);
      if (!text?.trim()) return res.status(502).json({ error: "Empty response" });
      res.json({ text });
    } catch (err) {
      console.error("[/api/generate-email]", err);
      res.status(500).json({ error: err?.message || "Generation failed" });
    }
  });
} else {
  app.all("/api/generate-email", (_req, res) => res.status(404).end());
}

// ───────────────────────────────────────────────────────────────────────────────
// 9) Casual chat
if (ENABLE_CHAT) {
  app.post("/api/chat", modelLimiter, async (req, res) => {
    try {
      const message = sanitizeText(req.body?.message, 2000);
      if (!message) return res.status(400).json({ error: "Missing 'message'" });

      const m = message.toLowerCase();
      const looksLikeGreeting =
        m.length <= 60 &&
        /^(hi|hey|hello|yo|sup|what'?s up|how (are|r) (you|u)|good (morning|afternoon|evening))\b/.test(m);

      if (looksLikeGreeting) {
        return res.json({
          text: "Hey! I’m doing well 😊 Chat casually here, or switch to Email Mode for a polished draft.",
        });
      }

      const client = ai();
      const r = await client.models.generateContent({
        model: MODEL,
        contents: `You are a friendly, conversational assistant. Respond naturally (do NOT write a formal email):\n\n"${message}"`,
      });
      const reply = r?.text ?? safeStitch(r) ?? "(no reply)";
      return res.json({ text: reply });
    } catch (err) {
      console.error("[/api/chat]", err);
      res.status(500).json({ error: err?.message || "Chat failed" });
    }
  });
} else {
  app.all("/api/chat", (_req, res) => res.status(404).end());
}

// ───────────────────────────────────────────────────────────────────────────────
// 10) Serve frontend in production (optional when hosting both on Render)
if (process.env.NODE_ENV === "production") {
  const distPath = path.resolve(__dirname, "../frontend/dist");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));
}

// ───────────────────────────────────────────────────────────────────────────────
// 11) Boot sequence
const port = process.env.PORT || 5000;

(async () => {
  try {
    const uri =
      process.env.MONGO_URI ||
      process.env.MONGODB_URI ||
      process.env.MONGODB_URI_DEV ||
      process.env.MONGODB_URI_PROD;

    if (!uri) throw new Error("Missing MongoDB URI");
    await connectDB();
    app.listen(port, () =>
      console.log(`✅ Backend running on http://localhost:${port}`)
    );
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
})();
