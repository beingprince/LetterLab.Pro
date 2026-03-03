// backend/routes/analytics.js
import express from 'express';
import User from '../models/User.js';
import AnalyticEvent from '../models/AnalyticEvent.js';
import { auth } from '../middleware/auth.js';
const router = express.Router();

const DEFAULT_CHAT_TOTAL = 50000;
const DEFAULT_EMAIL_TOTAL = 10;

console.log("✅ Analytics Route Module Loaded");

router.get('/ping', (req, res) => res.send('pong'));

/**
 * GET /api/analytics/overview?range=30d
 * Event-driven analytics matching UI cards
 */
router.get('/overview', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const range = req.query.range || '30d';
    const days = range === '7d' ? 7 : range === '90d' ? 90 : 30;
    const since = new Date();
    since.setUTCDate(since.getUTCDate() - days);
    since.setUTCHours(0, 0, 0, 0);

    const chatTotal = user.chatTokensLimit ?? DEFAULT_CHAT_TOTAL;
    const chatRemaining = user.chatTokensRemaining ?? chatTotal;
    const tokensUsed = chatTotal - chatRemaining;
    const resetDate = user.nextResetAt ?? new Date();
    const cycleEnd = new Date(resetDate);
    cycleEnd.setUTCDate(cycleEnd.getUTCDate() + 1);
    cycleEnd.setUTCHours(0, 0, 0, 0);

    const matchUserSince = { userId: user._id, createdAt: { $gte: since } };

    const [emailDrafts, threadsProcessed, featureCounts, usageByDay, heatmapUTC] = await Promise.all([
      AnalyticEvent.countDocuments({ ...matchUserSince, eventType: 'email_draft_created' }),
      AnalyticEvent.countDocuments({ ...matchUserSince, eventType: 'thread_analyzed' }),
      AnalyticEvent.aggregate([
        { $match: matchUserSince },
        { $group: { _id: '$eventType', count: { $sum: 1 } } }
      ]),
      AnalyticEvent.aggregate([
        { $match: matchUserSince },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'UTC' } },
            tokens: { $sum: '$tokensUsed' }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      AnalyticEvent.aggregate([
        { $match: matchUserSince },
        {
          $project: {
            dayOfWeek: { $dayOfWeek: { date: '$createdAt', timezone: 'UTC' } },
            hour: { $hour: { date: '$createdAt', timezone: 'UTC' } }
          }
        },
        {
          $group: {
            _id: { day: '$dayOfWeek', hour: '$hour' },
            value: { $sum: 1 }
          }
        }
      ])
    ]);

    const featureUsage = {
      chat_turn: 0,
      subject_generated: 0,
      summary_generated: 0,
      thread_read: 0
    };
    featureCounts.forEach((e) => {
      if (e._id in featureUsage) featureUsage[e._id] = e.count;
    });

    res.json({
      quotaRemaining: chatRemaining,
      quotaTotal: chatTotal,
      tokensUsed,
      emailsGenerated: emailDrafts,
      threadsProcessed,
      featureUsage,
      usageByDay: usageByDay.map((d) => ({ date: d._id, tokens: d.tokens })),
      heatmapUTC: {
        days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        hours: Array.from({ length: 24 }, (_, i) => i),
        values: heatmapUTC.map((d) => ({
          day: d._id.day - 1,
          hour: d._id.hour,
          value: d.value
        }))
      },
      currentPlan: user.plan || 'free',
      billingCycleStart: resetDate,
      billingCycleEnd: cycleEnd,
      nextReset: 'Daily at Midnight (UTC)',
      emailsRemainingToday: user.emailsRemainingToday ?? DEFAULT_EMAIL_TOTAL,
      emailsTotalPerDay: user.emailsLimitDaily ?? DEFAULT_EMAIL_TOTAL
    });
  } catch (err) {
    console.error('[GET /api/analytics/overview]', err);
    res.status(500).json({ error: 'Failed to fetch overview' });
  }
});

/**
 * GET /api/analytics/dashboard
 * Strict Data Protocol Implementation
 */
router.get('/dashboard', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 1. BILLING / QUOTA
    const chatTotal = user.chatTokensLimit ?? DEFAULT_CHAT_TOTAL;
    const chatRemaining = user.chatTokensRemaining ?? chatTotal;
    const resetDate = user.nextResetAt ?? user.lastTokenReset ?? new Date();
    const billing = {
      cycleStart: resetDate,
      cycleEnd: new Date(new Date(resetDate).getTime() + 24 * 60 * 60 * 1000),
      tokenLimit: chatTotal,
      tokensUsed: chatTotal - chatRemaining,
      tokensRemaining: chatRemaining,
      plan: user.plan || 'free',
      // E-Week: expose email quota
      emailsRemainingToday: user.emailsRemainingToday ?? DEFAULT_EMAIL_TOTAL,
      emailsTotalPerDay: user.emailsLimitDaily ?? DEFAULT_EMAIL_TOTAL
    };

    // 2. TOTALS (Aggregated from Events)
    // ----------------------------------------------------------------
    // Fallback to User.usageHistory if Events are empty (migration path)
    const eventCounts = await AnalyticEvent.aggregate([
      { $match: { userId: user._id } },
      { $group: { _id: "$eventType", count: { $sum: 1 } } }
    ]);

    const totals = {
      subjectsCreated: 0,
      repliesGenerated: 0,
      summariesCreated: 0,
      threadsRead: 0
    };

    eventCounts.forEach(e => {
      if (e._id === 'SUBJECT' || e._id === 'subject_generated') totals.subjectsCreated += e.count;
      if (e._id === 'REPLY' || e._id === 'email_draft_created') totals.repliesGenerated += e.count;
      if (e._id === 'SUMMARY' || e._id === 'summary_generated') totals.summariesCreated += e.count;
      if (e._id === 'THREAD_READ' || e._id === 'thread_read') totals.threadsRead += e.count;
    });

    // 3. TIMESERIES (Daily Usage - Last 30 Days, UTC)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 30);
    thirtyDaysAgo.setUTCHours(0, 0, 0, 0);

    const dailyUsage = await AnalyticEvent.aggregate([
      {
        $match: {
          userId: user._id,
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "UTC" } },
          tokens: { $sum: "$tokensUsed" },
          actions: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const timeseries = {
      tokensUsedDaily: dailyUsage.map(d => ({ date: d._id, value: d.tokens })),
      actionsDaily: dailyUsage.map(d => ({ date: d._id, value: d.actions }))
    };

    // 4. HEATMAP (Peak Hours, UTC)
    const heatData = await AnalyticEvent.aggregate([
      { $match: { userId: user._id } },
      {
        $project: {
          dayOfWeek: { $dayOfWeek: { date: "$createdAt", timezone: "UTC" } },
          hour: { $hour: { date: "$createdAt", timezone: "UTC" } }
        }
      },
      {
        $group: {
          _id: { day: "$dayOfWeek", hour: "$hour" },
          value: { $sum: 1 }
        }
      }
    ]);

    const heatmap = {
      days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      hours: Array.from({ length: 24 }, (_, i) => i), // 0-23
      values: heatData.map(d => ({
        day: d._id.day - 1, // Convert 1-based (Sun=1) to 0-based (Sun=0)
        hour: d._id.hour,
        value: d.value
      }))
    };


    res.json({
      billing,
      totals,
      timeseries,
      heatmap
    });

  } catch (error) {
    console.error('[GET /analytics/dashboard] Error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

/**
 * GET /api/analytics/usage (Legacy Support)
 * Keep this for backward compatibility if other components use it, 
 * or forward to dashboard subset.
 */
router.get('/usage', auth, async (req, res) => {
  // ... legacy implementation or redirect ...
  // For now, keep simpler version to avoid breaking potential lingering calls
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const chatTotal = user.chatTokensLimit ?? 50000;
    const chatRemaining = user.chatTokensRemaining ?? chatTotal;
    res.json({
      tokensRemaining: chatRemaining,
      tokensTotal: chatTotal,
      plan: user.plan,
      emailsRemainingToday: user.emailsRemainingToday ?? DEFAULT_EMAIL_TOTAL,
      emailsTotalPerDay: user.emailsLimitDaily ?? DEFAULT_EMAIL_TOTAL
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});

export default router;
