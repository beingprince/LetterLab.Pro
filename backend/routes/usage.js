// backend/routes/usage.js
import express from "express";
import Usage from "../models/Usage.js";

const router = express.Router();

// GET /api/usage/daily?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get("/daily", async (req, res, next) => {
  try {
    const userId = req.userId; // now from auth middleware
    const from = req.query.from ? new Date(req.query.from) : new Date(Date.now() - 14 * 864e5);
    const to = req.query.to ? new Date(req.query.to) : new Date();

    const rows = await Usage.find({
      userId,
      date: { $gte: from, $lte: to }
    }).sort({ date: 1 });

    res.json(rows);
  } catch (err) {
    console.error("[GET /api/usage/daily]", err);
    next(err);
  }
});

export default router;
