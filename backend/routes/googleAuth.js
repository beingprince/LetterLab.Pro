import express from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { issueSessionCookies } from "../utils/cookieConfig.js";
import User from "../models/User.js";

const router = express.Router();

// ── Provider availability check ──────────────────────────────────────────────
const GOOGLE_CONFIGURED =
  !!process.env.GOOGLE_CLIENT_ID &&
  !!process.env.GOOGLE_CLIENT_SECRET &&
  !!process.env.GOOGLE_REDIRECT_URI;

if (!GOOGLE_CONFIGURED) {
  console.warn(
    "[googleAuth] ⚠️  Google OAuth is DISABLED — missing GOOGLE_CLIENT_ID, " +
    "GOOGLE_CLIENT_SECRET, or GOOGLE_REDIRECT_URI. Set these in your environment."
  );
} else {
  console.log("[googleAuth] ✅ Google OAuth redirect URI:", process.env.GOOGLE_REDIRECT_URI);
}

const client = GOOGLE_CONFIGURED
  ? new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )
  : null;

/** Guard: returns 503 when Google OAuth is not configured. */
function requireGoogleConfig(req, res, next) {
  if (!GOOGLE_CONFIGURED) {
    return res.status(503).json({ error: "Google OAuth is not configured on this server." });
  }
  return next();
}

// ──────────────────────────────────────────────
// STEP 1: Redirect user to Google OAuth consent page
// ──────────────────────────────────────────────
router.get("/", requireGoogleConfig, (req, res) => {
  console.log("[googleAuth] /auth/google hit");

  const authUrl = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "openid",
      "email",
      "profile",
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.send",
    ],
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
  });

  res.redirect(authUrl);
});

// ──────────────────────────────────────────────
// STEP 2: Handle callback from Google
// ──────────────────────────────────────────────
router.get("/callback", requireGoogleConfig, async (req, res) => {
  const { code, state } = req.query;
  if (!code) return res.status(400).send("No auth code provided");

  try {
    const stateCookie = req.cookies?.oauth_state;
    if (stateCookie && stateCookie !== state) {
      return res.status(400).send("Invalid OAuth state");
    }
  } catch { }

  try {
    // Exchange code for tokens
    const { tokens } = await client.getToken({
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    });

    // Verify ID token and extract profile
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // ✅ Find or create user in MongoDB
    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = await User.create({
        name: payload.name,
        email: payload.email,
        password: crypto.randomBytes(16).toString("hex"),
        googleAccessToken: tokens.access_token,
        gmailRefreshToken: tokens.refresh_token,
        googleTokenExpiry: new Date(tokens.expiry_date),
        // Set initial quotas for launch
        chatTokensLimit: 50000,
        chatTokensRemaining: 50000,
        emailsLimitDaily: 10,
        emailsRemainingToday: 10,
        nextResetAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      });
    } else {
      // Update tokens for existing user
      user.googleAccessToken = tokens.access_token;
      if (tokens.refresh_token) {
        user.gmailRefreshToken = tokens.refresh_token;
      }
      user.googleTokenExpiry = new Date(tokens.expiry_date);
      await user.save();
    }

    // ✅ Generate your signed JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Set cookies (optional if you want session)
    issueSessionCookies(res, {
      accessToken: token,
      refreshToken: jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      ),
    });

    // ✅ Redirect frontend with token param — always use FRONTEND_URL
    const frontendBase = process.env.FRONTEND_URL;
    if (!frontendBase) {
      console.error("[googleAuth] ❌ FRONTEND_URL is not set. Cannot redirect after OAuth.");
      return res.status(500).send("Server misconfiguration: FRONTEND_URL is not defined.");
    }
    const redirectURL = `${frontendBase}/account?token=${token}`;
    console.log("[googleAuth] Redirecting to:", redirectURL);
    return res.redirect(redirectURL);
  } catch (err) {
    console.error("Google OAuth Error:", err);
    res.status(500).send("Authentication failed");
  }
});

export default router;
