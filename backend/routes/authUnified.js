// backend/routes/authUnified.js
// ──────────────────────────────────────────────
// Unified JWT-based session route for Google + Outlook logins
// ──────────────────────────────────────────────

import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET is required. Add it to .env');

// Helper: sign JWT
function signToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// ──────────────────────────────────────────────
// 🔹 POST /auth/jwt-login
// Called from frontend after Google or Outlook login
// ──────────────────────────────────────────────
router.post("/jwt-login", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!email || !name) {
      return res.status(400).json({ error: "Missing name or email" });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        password: "oauth_" + Math.random().toString(36).slice(2),
      });
    }

    const token = signToken(user);
    return res.json({ success: true, token, user });
  } catch (err) {
    console.error("JWT Login Error:", err);
    res.status(500).json({ error: "Server error during JWT login" });
  }
});

// ──────────────────────────────────────────────
// 🔹 GET /auth/status
// Verify and return user details for frontend session restore
// ──────────────────────────────────────────────
router.get("/status", async (req, res) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token)
      return res.status(401).json({ error: "Missing token in Authorization header" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json({ success: true, user });
  } catch (err) {
    console.error("JWT Status Error:", err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

// ──────────────────────────────────────────────
// 🔹 POST /auth/logout
// Simple client-side token invalidation (frontend removes token)
// ──────────────────────────────────────────────
router.post("/logout", (_req, res) => {
  return res.json({ success: true, message: "Logged out successfully" });
});

export default router;
