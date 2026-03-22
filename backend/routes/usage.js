import express from 'express';
import { auth } from '../middleware/auth.js';
import User from '../models/User.js';
import { calculateResetTime } from '../middleware/tokenMiddleware.js';

const router = express.Router();

/**
 * GET /api/usage/me
 * Unified usage contract for Analytics and Account screens
 */
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Ensure user has initial values if somehow missing
    const chatUsed = (user.chatTokensLimit || 5000) - (user.chatTokensRemaining || 0);
    const emailsUsed = (user.emailsLimitDaily || 10) - (user.emailsRemainingToday || 0);

    res.json({
      chatTokensUsed: chatUsed,
      chatTokensRemaining: user.chatTokensRemaining || 0,
      chatTokensLimit: user.chatTokensLimit || 5000,
      emailsUsedToday: emailsUsed,
      emailsRemainingToday: user.emailsRemainingToday || 0,
      emailsLimitDaily: user.emailsLimitDaily || 10,
      nextResetAt: user.nextResetAt,
      resetIn: user.nextResetAt ? calculateResetTime(user.nextResetAt) : 'Unknown',
      timezone: 'Central Time (America/Chicago)'
    });
  } catch (error) {
    console.error('Failed to fetch usage:', error);
    res.status(500).json({ error: 'Failed to fetch usage data' });
  }
});

export default router;
