// backend/middleware/auth.js
import jwt from "jsonwebtoken";

/**
 * Require a valid JWT in Authorization header ("Bearer <token>").
 * Puts user id into req.userId on success.
 */
export function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");
    req.userId = decoded.id;
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

/** Optional: allow if token present, but don’t fail if missing (for public pages) */
export function authOptional(req, _res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");
    req.userId = decoded.id;
  } catch {}
  return next();
}
