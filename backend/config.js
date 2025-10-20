// backend/config.js
export const NODE_ENV = process.env.NODE_ENV || "development";    // development | production
export const APP_ENV  = process.env.APP_ENV  || "beta";           // beta | prod | staging

// Feature flags (OFF by default for beta)
export const ENABLE_CHAT  = process.env.ENABLE_CHAT === "1";      // 0 or 1
export const ENABLE_EMAIL = process.env.ENABLE_EMAIL !== "0";     // default ON

// CORS allowlist (comma-separated)
export const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);
