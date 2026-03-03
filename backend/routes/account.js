import express from 'express';
import { auth } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

const SELECT = 'name email displayName avatarUrl plan createdAt '
  + 'chatTokensLimit chatTokensRemaining '
  + 'emailsLimitDaily emailsRemainingToday nextResetAt '
  + '+googleAccessToken +outlookAccessToken';

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(SELECT);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        displayName: user.displayName || user.name || '',
        email: user.email,
        memberSince: user.createdAt,
        plan: user.plan || 'free',
        avatarUrl: user.avatarUrl || undefined,
      },
      quota: {
        chatTokensRemaining: user.chatTokensRemaining ?? 0,
        chatTokensLimit: user.chatTokensLimit ?? 50000,
        emailsRemainingToday: user.emailsRemainingToday ?? 0,
        emailsLimitDaily: user.emailsLimitDaily ?? 10,
        nextResetAtUTC: user.nextResetAt,
      },
      integrations: {
        google: {
          connected: !!(user.googleAccessToken),
        },
        outlook: {
          connected: !!(user.outlookAccessToken),
        },
      },
    });
  } catch (err) {
    console.error('Account /me error:', err);
    res.status(500).json({ error: 'Failed to load account' });
  }
});

export default router;
