// backend/middleware/auth.js
// ──────────────────────────────────────────────────────────────
// Handles JWT verification for protected routes in LetterLab Pro
// Keeps same import style and error format as rest of backend
// ──────────────────────────────────────────────────────────────

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET is required. Add it to .env');

/**
 * Require a valid JWT in Authorization header ("Bearer <token>").
 * Attaches decoded payload as req.user.
 */
export function auth(req, res, next) {
  const header = req.headers.authorization || "";
  let token = header.startsWith("Bearer ") ? header.slice(7) : null;

  // Allow token via query param (for SSE)
  if (!token && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ error: "Missing token. Authorization denied." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ error: `Invalid or expired token. (${err.message})` });
  }
}

/**
 * Optional middleware — allows route access without token,
 * but attaches decoded payload if token present.
 */
export function authOptional(req, _res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch {
    // ignore errors silently for optional routes
  }
  return next();
}
