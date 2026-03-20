// backend/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import { GoogleGenAI } from "@google/genai";

import connectDB, { mongoState } from "./db.js";
import { auth } from "./middleware/auth.js";
import conversationRoutes from "./routes/conversations.js";

import * as emailService from './services/EmailServiceV2.js'; // V2 Fix for Graph API
import usageRouter from "./routes/usage.js";
import usersRouter from "./routes/users.js";
import analyticsRoutes from "./routes/analytics.js";
import { initializeCronJobs } from "./utils/cronJobs.js";
import googleAuthRoutes from "./routes/googleAuth.js";
import outlookOAuthRoutes from "./routes/outlookOAuth.js";
import mongoose from "mongoose";
import professorRoutes from "./routes/professors.js";
import Professor from "./models/Professor.js";
import aiRoutes from "./routes/ai.js";
import apiRoutes from "./routes/api.js";
import gmailRoutes from "./routes/gmailRoutes.js";
import outlookRoutes from "./routes/outlookRoutes.js";
import auth2faRouter from "./routes/auth2fa.js";
import accountRouter from "./routes/account.js";
import footerPagesRouter from "./routes/footerPages.js";
import statusRouter from "./routes/status.js";
import contactRouter from "./routes/contact.js";
import reviewsRouter from "./routes/reviews.js";
import documentRoutes from "./routes/documentRoutes.js";
import documentUploadRouter from "./routes/documentUpload.js";

// 0) Path aliases for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.resolve(__dirname, "public");

// ───────────────────────────────────────────────────────────────────────────────
// Feature flags & config (from .env)
const ENABLE_CHAT = process.env.ENABLE_CHAT === "1";      // 0 (off) or 1 (on)
const ENABLE_EMAIL = process.env.ENABLE_EMAIL !== "0";     // default ON

// ⭐ CORS: merge hardcoded prod domains with CORS_ORIGINS env var (comma-separated)
const HARDCODED_ORIGINS = [
  "http://localhost:5173",
  "https://letterlab.pro",
  "https://www.letterlab.pro",
  "https://letter-lab-84tso78qn-beingprinces-projects.vercel.app",
];
const ENV_ORIGINS = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean)
  : [];
const ALLOWED_ORIGINS = Array.from(new Set([...HARDCODED_ORIGINS, ...ENV_ORIGINS]));

// 1) Initialize app FIRST
const app = express();

// ───────────────────────────────────────────────────────────────────────────────
// 2) Security + CORS + body limits (BEFORE routes)
app.use(helmet());

// Serve robots.txt immediately to prevent indexing of Render wakeup page
app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send("User-agent: *\nDisallow: /");
});

// ⭐ UPDATED: robust CORS (handles preflight + Vercel previews)
app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);        // server-to-server/health
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);

    // allow any vercel preview domain
    try {
      const host = new URL(origin).hostname;
      if (host.endsWith(".vercel.app")) return cb(null, true);
    } catch { }

    return cb(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
  maxAge: 86400,
}));
app.options("*", cors());
app.use(cookieParser()); // Required for req.cookies in OAuth state validation


// Tighter body size limits to control cost (increased to 10mb for email threads)
app.use(express.json({ limit: "10mb" }));
app.use(express.text({ type: ["text/plain", "text/*"], limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ───────────────────────────────────────────────────────────────────────────────
// 3) Rate Limiters + Request Logging
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
const GEMINI_MODEL = process.env.GEMINI_MODEL_PRIMARY || "models/gemini-2.5-flash";
const GEMINI_FALLBACK_MODEL = process.env.GEMINI_MODEL_FALLBACK || "models/gemini-2.5-flash";

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

async function generateContentWithFallback(contents) {
  const geminiModels = [GEMINI_MODEL, GEMINI_FALLBACK_MODEL];
  let lastErr = null;

  // Tier 1 + 2: Try each Gemini model
  for (const modelName of geminiModels) {
    try {
      console.log("[AI] Gemini model:", modelName);
      const client = ai();
      const r = await client.models.generateContent({ model: modelName, contents });
      return { ok: true, text: r?.text ?? safeStitch(r), model: modelName };
    } catch (err) {
      lastErr = err;
      console.warn(`⚠️ [AI] Gemini (${modelName}) failed:`, err.message);
    }
  }

  // Tier 3: OpenAI fallback (only if OPENAI_API_KEY is defined)
  if (process.env.OPENAI_API_KEY) {
    try {
      const { default: OpenAI } = await import("openai");
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const prompt = typeof contents === "string" ? contents : JSON.stringify(contents);
      console.log("[AI] Falling back to OpenAI (gpt-4o-mini)");
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      });
      const text = completion.choices?.[0]?.message?.content ?? "";
      return { ok: true, text, model: "openai" };
    } catch (err) {
      console.warn("⚠️ [AI] OpenAI fallback failed:", err.message);
      lastErr = err;
    }
  } else {
    console.warn("[AI] OpenAI fallback skipped — OPENAI_API_KEY not set.");
  }

  throw lastErr;
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
    const { text } = await generateContentWithFallback("ping");
    payload.modelPing = (text ?? "").slice(0, 80) || "(no text)";
    res.json(payload);
  } catch (err) {
    payload.modelPing = "ERROR";
    payload.errorInfo = { message: err?.message, code: err?.code, status: err?.status };
    console.error("[/api/health]", err);
    res.json(payload);
  }
});

// ───────────────────────────────────────────────────────────────────────────────
// 6) Public auth + footer pages content + status + contact
app.use("/api/users", usersRouter);
app.use("/api/footer-pages", footerPagesRouter);
app.use("/api/status", statusRouter);
app.use("/api/contact", contactRouter);
app.use("/api/reviews", reviewsRouter);

// ───────────────────────────────────────────────────────────────────────────────
// 7) Protected routes
app.use("/api/conversations", conversationRoutes);
console.log("Mounting /api/analytics...");
app.use("/api/analytics", analyticsRoutes);
app.use("/api/usage", auth, usageRouter);
app.use("/auth/google", googleAuthRoutes);
app.use("/api/oauth", outlookOAuthRoutes);
app.use("/api/professors", auth, professorRoutes);
// Explicit DELETE route to guarantee /api/professors/:id is matched (avoids router mount ambiguity)
app.delete("/api/professors/:id", auth, async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized." });
    }
    const id = req.params.id;
    if (!id || typeof id !== "string" || id.length !== 24) {
      return res.status(400).json({ error: "Invalid id." });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid id." });
    }
    const deleted = await Professor.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });
    if (!deleted) {
      return res.status(404).json({ error: "Professor not found." });
    }
    return res.status(200).json({ success: true, deletedId: id });
  } catch (err) {
    return res.status(500).json({ error: err?.message || "Server error deleting professor." });
  }
});
app.use("/api/ai", auth, aiRoutes);
app.use("/api/account", auth, accountRouter); // Must be before /api to avoid 404
// 🚨 DEBUG: Direct Route Definition to Fix 404 (Moved BEFORE apiRoutes to take precedence)
app.post('/api/analyze-thread', auth, async (req, res) => {
  console.log("⚡ HIT DIRECT /api/analyze-thread (V2 Logic)");
  try {
    const { conversationId, outlookAccessToken } = req.body;
    if (!conversationId || !outlookAccessToken) {
      return res.status(400).json({ error: "Missing conversationId or access token." });
    }
    const analysis = await emailService.analyzeThreadContext(outlookAccessToken, conversationId, req.user.id);
    res.json(analysis);
  } catch (error) {
    console.error("Thread Analysis Failed (Direct V2):", error);
    res.status(500).json({ error: "Failed to analyze thread context." });
  }
});

app.use("/api", apiRoutes);
app.use("/api/v1/documents", documentRoutes);
app.use("/api/v1/documents", documentUploadRouter); // handles /upload-and-process and /:id/status

console.log("✅ Mounted /api routes (Analysis, One-time pull)");
app.use("/api/gmail", gmailRoutes);
app.use("/api/outlook", outlookRoutes);

app.use("/api/2fa", auth2faRouter);

// E-Week: localhost-only quota reset for demo
app.post("/api/admin/reset-quotas", auth, async (req, res) => {
  const isLocalhost = req.hostname === "localhost" || req.hostname === "127.0.0.1" || process.env.NODE_ENV === "development";
  if (!isLocalhost) {
    return res.status(403).json({ error: "Admin reset is localhost only" });
  }
  try {
    const User = (await import("./models/User.js")).default;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    const chatTotal = user.chatTokensLimit ?? 50000;
    const emailTotal = user.emailsLimitDaily ?? 10;
    await User.findByIdAndUpdate(req.user.id, {
      chatTokensRemaining: chatTotal,
      nextResetAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Reset to 24h from now
      emailsRemainingToday: emailTotal
    });
    console.log(`[Admin] Reset quotas for user ${req.user.id}`);
    res.json({ ok: true, chatTokensRemaining: chatTotal, emailsRemainingToday: emailTotal });
  } catch (err) {
    console.error("[/api/admin/reset-quotas]", err);
    res.status(500).json({ error: err?.message || "Reset failed" });
  }
});

// ───────────────────────────────────────────────────────────────────────────────
// 8) Email generator
if (ENABLE_EMAIL) {
  app.post("/api/generate-email", modelLimiter, async (req, res) => {
    try {
      const notes = sanitizeText(req.body?.notes || req.body?.prompt, 4000);
      const tone = sanitizeText(req.body?.tone || "Professional", 40);

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

      const { text } = await generateContentWithFallback(prompt);
      if (!text?.trim()) return res.status(502).json({ error: "Empty response" });
      res.json({ text, body: text });
    } catch (err) {
      console.error("[/api/generate-email]", err);
      res.status(500).json({ error: err?.message || "Generation failed" });
    }
  });
  // Alias for backward compatibility and simpler frontend calls
  app.post("/api/generate", modelLimiter, (req, res, next) => {
    req.url = "/api/generate-email";
    app._router.handle(req, res, next);
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

      const { text } = await generateContentWithFallback(
        `You are a friendly, conversational assistant. Respond naturally (do NOT write a formal email):\n\n"${message}"`
      );
      const reply = (text ?? "").trim() || "(no reply)";
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
// ───────────────────────────────────────────────────────────────────────────────
// 10) Public Assets
app.use(express.static(publicPath));

// 11) Serve frontend in production (optional when hosting both on Render)
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
    initializeCronJobs();
    console.log(`[Config] GEMINI_MODEL_PRIMARY=${process.env.GEMINI_MODEL_PRIMARY || "(default: models/gemini-2.5-flash)"}`);
    console.log(`[Config] GEMINI_MODEL_FALLBACK=${process.env.GEMINI_MODEL_FALLBACK || "(default: models/gemini-2.5-flash)"}`);
    console.log(`[Config] GEMINI_MODEL_CHAT=${process.env.GEMINI_MODEL_CHAT || "(default: primary)"}`);
    app.listen(port, () =>
      console.log(`✅ Backend running on http://localhost:${port}`)
    );
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
})();
