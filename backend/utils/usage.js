import User from '../models/User.js';

/**
 * Tracks usage for a user.
 * @param {string} userId - The ID of the user.
 * @param {string} actionType - 'email_generation' or 'summarization'.
 * @param {number} tokensUsed - The number of tokens used.
 */
export async function trackUsage(userId, actionType, tokensUsed) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            console.error(`[trackUsage] User not found: ${userId}`);
            return;
        }

        // Initialize usage history if it doesn't exist
        if (!user.usageHistory) {
            user.usageHistory = [];
        }

        // Update total tokens used (if you have a total field, otherwise it's derived)
        // user.totalTokensUsed = (user.totalTokensUsed || 0) + tokensUsed;

        // Update tokens remaining (simple subtraction for now)
        if (user.tokensRemaining !== undefined) {
            user.tokensRemaining = Math.max(0, user.tokensRemaining - tokensUsed);
        }

        // Find or create today's usage entry
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let todayEntry = user.usageHistory.find(entry => {
            const entryDate = new Date(entry.date);
            entryDate.setHours(0, 0, 0, 0);
            return entryDate.getTime() === today.getTime();
        });

        if (!todayEntry) {
            todayEntry = {
                date: today,
                tokensUsed: 0,
                emailsGenerated: 0,
                summarizations: 0,
            };
            user.usageHistory.push(todayEntry);
        }

        // Update the entry
        todayEntry.tokensUsed += tokensUsed;
        if (actionType === 'email_generation') {
            todayEntry.emailsGenerated = (todayEntry.emailsGenerated || 0) + 1;
        } else if (actionType === 'summarization') {
            todayEntry.summarizations = (todayEntry.summarizations || 0) + 1;
        }

        await user.save();
        console.log(`[trackUsage] Tracked ${tokensUsed} tokens for user ${userId} (${actionType})`);

    } catch (error) {
        console.error('[trackUsage] Error tracking usage:', error);
    }
}
