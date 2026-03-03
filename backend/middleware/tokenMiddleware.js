// backend/middleware/tokenMiddleware.js
import User from '../models/User.js';
import SystemStatus from '../models/SystemStatus.js';

export const TOKEN_COSTS = {
    EMAIL_GENERATION: 1000, // example cost for chat tokens
    SUMMARIZATION: 500,
    SIMPLE_QUERY: 100,
};

const GLOBAL_CHAT_LIMIT = 5000000;
const GLOBAL_EMAIL_LIMIT = 1000;

/**
 * Get or initialize global quota record
 */
async function getGlobalQuota() {
    let status = await SystemStatus.findOne({ key: 'global_quota' });
    if (!status) {
        status = await SystemStatus.create({
            key: 'global_quota',
            globalChatCreditsUsedToday: 0,
            globalEmailSendsUsedToday: 0,
            lastResetAt: new Date()
        });
    }

    // Check global reset (daily)
    const now = new Date();
    const lastReset = new Date(status.lastResetAt);
    if (now.getDate() !== lastReset.getDate()) {
        status.globalChatCreditsUsedToday = 0;
        status.globalEmailSendsUsedToday = 0;
        status.lastResetAt = now;
        await status.save();
        console.log("🌍 Global quotas reset for new day");
    }
    return status;
}

/**
 * Reset individual user tokens if past nextResetAt
 */
async function checkIndividualReset(user) {
    const now = new Date();
    if (!user.nextResetAt || now > user.nextResetAt) {
        user.chatTokensRemaining = user.chatTokensLimit || 50000;
        user.emailsRemainingToday = user.emailsLimitDaily || 10;
        // Set next reset to 24h from now (or midnight tomorrow)
        user.nextResetAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        await user.save();
        console.log(`✅ Individual reset for ${user.email}. Next: ${user.nextResetAt.toLocaleString()}`);
    }
}

/**
 * Unified Token Check Middleware
 */
export const checkTokens = (requiredTokens, isEmailSend = false) => {
    return async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ error: 'Unauthorized' });

            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ error: 'User not found' });

            // 1. Individual Reset Check
            await checkIndividualReset(user);

            // 2. Global Budget Check
            const globalStatus = await getGlobalQuota();

            if (isEmailSend) {
                if (globalStatus.globalEmailSendsUsedToday >= GLOBAL_EMAIL_LIMIT) {
                    return res.status(429).json({
                        code: 'GLOBAL_CAP_REACHED',
                        message: 'System-wide daily email limit reached.',
                        resetAt: user.nextResetAt
                    });
                }
            } else {
                if (globalStatus.globalChatCreditsUsedToday >= GLOBAL_CHAT_LIMIT) {
                    return res.status(429).json({
                        code: 'GLOBAL_CAP_REACHED',
                        message: 'System-wide daily AI credit limit reached.',
                        resetAt: user.nextResetAt
                    });
                }
            }

            // 3. User Quota Check
            if (isEmailSend) {
                if (user.emailsRemainingToday < 1) {
                    return res.status(429).json({
                        code: 'QUOTA_EXCEEDED',
                        message: 'Personal daily email limit reached.',
                        resetAt: user.nextResetAt
                    });
                }
            } else {
                if (user.chatTokensRemaining < requiredTokens) {
                    return res.status(429).json({
                        code: 'QUOTA_EXCEEDED',
                        message: 'Personal daily AI credit limit reached.',
                        resetAt: user.nextResetAt
                    });
                }
            }

            req.userDoc = user;
            next();
        } catch (error) {
            console.error('[checkTokens] Error:', error);
            res.status(500).json({ error: 'Token check failed' });
        }
    };
};

/**
 * Deduct tokens from User and Global record
 */
export const deductTokens = async (userId, chatAmount = 0, isEmailSend = false) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        const globalStatus = await getGlobalQuota();

        if (chatAmount > 0) {
            user.chatTokensRemaining = Math.max(0, user.chatTokensRemaining - chatAmount);
            globalStatus.globalChatCreditsUsedToday += chatAmount;

            // Log history
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            let entry = user.usageHistory.find(h => new Date(h.date).getTime() === today.getTime());
            if (!entry) {
                entry = { date: today, tokensUsed: 0, emailsGenerated: 0 };
                user.usageHistory.push(entry);
            }
            entry.tokensUsed += chatAmount;
        }

        if (isEmailSend) {
            user.emailsRemainingToday = Math.max(0, user.emailsRemainingToday - 1);
            globalStatus.globalEmailSendsUsedToday += 1;

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            let entry = user.usageHistory.find(h => new Date(h.date).getTime() === today.getTime());
            if (entry) entry.emailsGenerated += 1;
        }

        await user.save();
        await globalStatus.save();

        return {
            success: true,
            chatTokensRemaining: user.chatTokensRemaining,
            emailsRemainingToday: user.emailsRemainingToday
        };
    } catch (error) {
        console.error('[deductTokens] Error:', error);
        throw error;
    }
};

export const calculateResetTime = (nextResetAt) => {
    const now = new Date();
    const diff = new Date(nextResetAt) - now;
    if (diff <= 0) return 'Now';
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
};
