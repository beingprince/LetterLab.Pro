// backend/routes/session.js
import express from "express";
import { auth as requireAuth } from "../middleware/auth.js";
import { authCookieOptions } from "../utils/cookieConfig.js";

const router = express.Router();

/**
 * GET /me
 * Returns the authenticated user (reads access token from cookie).
 */
router.get("/me", requireAuth, (req, res) => res.json({ user: req.user }));
router.post("/auth/logout", (req, res) => {
  const opts = authCookieOptions();
  res.cookie("ll_access","",{...opts,maxAge:0});
  res.cookie("ll_refresh","",{...opts,maxAge:0});
  res.json({ok:true});
});

export default router;
