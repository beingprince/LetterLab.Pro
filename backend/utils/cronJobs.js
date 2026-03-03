// backend/utils/cronJobs.js
import cron from 'node-cron';
import User from '../models/User.js';

const DEFAULT_CHAT_TOTAL = 50000;
const DEFAULT_EMAIL_TOTAL = 10;

/**
 * Midnight UTC reset: chat + email quotas for free users
 */
export const initializeCronJobs = () => {
  cron.schedule('0 0 * * *', async () => {
    try {
      console.log('🔄 Running daily quota reset (midnight UTC)...');

      const result = await User.updateMany(
        { plan: 'free' },
        [
          {
            $set: {
              chatTokensRemaining: { $ifNull: ['$chatTokensLimit', DEFAULT_CHAT_TOTAL] },
              emailsRemainingToday: { $ifNull: ['$emailsLimitDaily', DEFAULT_EMAIL_TOTAL] },
              nextResetAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
            }
          }
        ]
      );

      console.log(`✅ Reset quotas for ${result.modifiedCount} free tier users`);

      // Optional: log reset_cycle for first user as debug (or skip to avoid noise)
    } catch (error) {
      console.error('❌ Quota reset cron job failed:', error);
    }
  });

  console.log('⏰ Cron jobs initialized: Daily quota reset at midnight UTC');
};
