import express from 'express';
import mongoose from 'mongoose';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';
import { checkTokens, deductTokens } from '../middleware/tokenMiddleware.js';

const router = express.Router();

// Helper to get OAuth client
const getOAuthClient = () => {
    return new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );
};

// Helper to set OAuth credentials (supports auto-refresh when refresh_token is present)
// Optionally persists refreshed tokens to user
const setUserCredentials = (client, user, persistRefresh = false) => {
    const creds = {
        access_token: user.googleAccessToken,
        expiry_date: user.googleTokenExpiry?.getTime?.() || null
    };
    if (user.gmailRefreshToken) creds.refresh_token = user.gmailRefreshToken;
    client.setCredentials(creds);
    if (persistRefresh) {
        client.on('tokens', async (tokens) => {
            if (tokens.access_token && user._id) {
                try {
                    await User.findByIdAndUpdate(user._id, {
                        googleAccessToken: tokens.access_token,
                        googleTokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined
                    });
                } catch (e) {
                    console.error('[Gmail] Failed to persist refreshed token:', e.message);
                }
            }
        });
    }
};

// GET /api/gmail/status
router.get('/status', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('+googleAccessToken +gmailRefreshToken +googleTokenExpiry');

        if (!user || !user.googleAccessToken) {
            return res.json({ connected: false });
        }

        // Verify the token is valid (OAuth2Client auto-refreshes when refresh_token present)
        const client = getOAuthClient();
        setUserCredentials(client, user);

        const gmail = google.gmail({ version: 'v1', auth: client });
        await gmail.users.getProfile({ userId: 'me' });

        res.json({ connected: true });
    } catch (error) {
        console.error('Gmail status check failed:', error.message);
        res.json({ connected: false });
    }
});

// GET /api/gmail/messages
router.get('/messages', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('+googleAccessToken +gmailRefreshToken +googleTokenExpiry');
        if (!user || !user.googleAccessToken) {
            return res.status(401).json({ error: 'Gmail not connected' });
        }

        const client = getOAuthClient();
        setUserCredentials(client, user);

        const gmail = google.gmail({ version: 'v1', auth: client });

        // List messages
        const query = req.query.q || 'category:primary';
        const response = await gmail.users.messages.list({
            userId: 'me',
            maxResults: 10,
            q: query
        });

        const messages = response.data.messages || [];

        // Fetch details for each message
        const detailedMessages = await Promise.all(messages.map(async (msg) => {
            const details = await gmail.users.messages.get({
                userId: 'me',
                id: msg.id,
                format: 'full'
            });

            const headers = details.data.payload.headers;
            const subject = headers.find(h => h.name === 'Subject')?.value || '(No Subject)';
            const from = headers.find(h => h.name === 'From')?.value || 'Unknown';
            const date = headers.find(h => h.name === 'Date')?.value;
            const snippet = details.data.snippet;

            return {
                id: msg.id,
                threadId: msg.threadId,
                subject,
                from,
                date,
                snippet
            };
        }));

        res.json({ messages: detailedMessages });

    } catch (error) {
        console.error('Failed to fetch Gmail messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// GET /api/gmail/threads/by-professor
router.get('/threads/by-professor', auth, async (req, res) => {
    console.log(`[Gmail] GET /threads/by-professor called for user ${req.user.id}`);
    try {
        const user = await User.findById(req.user.id).select('+googleAccessToken +gmailRefreshToken +googleTokenExpiry');
        if (!user || !user.googleAccessToken) {
            console.log('[Gmail] User has no googleAccessToken');
            return res.status(401).json({ error: 'Gmail not connected' });
        }

        const professorEmail = req.query.email;
        console.log(`[Gmail] Searching for threads with: ${professorEmail}`);

        if (!professorEmail) {
            return res.status(400).json({ error: 'Professor email is required' });
        }

        const client = getOAuthClient();
        setUserCredentials(client, user, true);

        const gmail = google.gmail({ version: 'v1', auth: client });

        // Search for threads with this professor
        const query = `from:${professorEmail} OR to:${professorEmail}`;
        console.log(`[Gmail] Query: ${query}`);

        const response = await gmail.users.threads.list({
            userId: 'me',
            maxResults: 20,
            q: query
        });

        const threads = response.data.threads || [];
        console.log(`[Gmail] Found ${threads.length} threads`);

        // Fetch details for each thread
        const detailedThreads = await Promise.all(threads.map(async (thread) => {
            const threadDetails = await gmail.users.threads.get({
                userId: 'me',
                id: thread.id,
                format: 'metadata',
                metadataHeaders: ['Subject', 'From', 'To', 'Date']
            });

            const messages = threadDetails.data.messages || [];
            const firstMessage = messages[0];
            const lastMessage = messages[messages.length - 1];

            const headers = firstMessage?.payload?.headers || [];
            const subject = headers.find(h => h.name === 'Subject')?.value || '(No Subject)';

            // Get participants (unique emails from all messages)
            const participants = new Set();
            messages.forEach(msg => {
                const msgHeaders = msg.payload?.headers || [];
                const from = msgHeaders.find(h => h.name === 'From')?.value;
                const to = msgHeaders.find(h => h.name === 'To')?.value;
                if (from) participants.add(from.match(/<(.+?)>/)?.[1] || from);
                if (to) to.split(',').forEach(email => participants.add(email.trim().match(/<(.+?)>/)?.[1] || email.trim()));
            });

            const lastMessageHeaders = lastMessage?.payload?.headers || [];
            const lastMessageDate = lastMessageHeaders.find(h => h.name === 'Date')?.value;

            return {
                id: thread.id,
                subject,
                snippet: threadDetails.data.snippet || '',
                participants: Array.from(participants),
                lastMessageDate,
                messageCount: messages.length,
                unread: messages.some(msg => msg.labelIds?.includes('UNREAD'))
            };
        }));

        res.json({ threads: detailedThreads });

    } catch (error) {
        const code = error.code ?? error.response?.status;
        let status = 500;
        let msg = error.message || 'Failed to fetch threads';
        if (code === 401) {
            status = 401;
            msg = 'Gmail token expired. Please reconnect Gmail in Settings.';
        } else if (code === 403) {
            status = 403;
            msg = error.message; // Google's message explains how to enable Gmail API
        }
        console.error('[Gmail] threads/by-professor error:', { message: error.message, code, status });
        res.status(status).json({ error: msg });
    }
});

// GET /api/gmail/threads/:id
router.get('/threads/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('+googleAccessToken +gmailRefreshToken +googleTokenExpiry');
        if (!user || !user.googleAccessToken) {
            return res.status(401).json({ error: 'Gmail not connected' });
        }

        const threadId = req.params.id;
        const client = getOAuthClient();
        setUserCredentials(client, user);

        const gmail = google.gmail({ version: 'v1', auth: client });

        // Fetch thread details
        const response = await gmail.users.threads.get({
            userId: 'me',
            id: threadId,
            format: 'full' // Get full content for analysis
        });

        const messages = response.data.messages || [];

        // Simplify messages
        const simpleMessages = messages.map(msg => {
            const headers = msg.payload.headers;
            const subject = headers.find(h => h.name === 'Subject')?.value || '(No Subject)';
            const from = headers.find(h => h.name === 'From')?.value || 'Unknown';
            const date = headers.find(h => h.name === 'Date')?.value;
            const snippet = msg.snippet;

            // Extract body (prefer text/plain)
            let body = '';
            if (msg.payload.body.data) {
                body = Buffer.from(msg.payload.body.data, 'base64').toString('utf-8');
            } else if (msg.payload.parts) {
                const part = msg.payload.parts.find(p => p.mimeType === 'text/plain') || msg.payload.parts[0];
                if (part && part.body.data) {
                    body = Buffer.from(part.body.data, 'base64').toString('utf-8');
                }
            }

            return {
                id: msg.id,
                threadId: msg.threadId,
                subject,
                from,
                date,
                snippet,
                body
            };
        });

        try {
            const { logAnalyticEvent } = await import('../utils/analyticEvents.js');
            await logAnalyticEvent({
                userId: req.user.id,
                eventType: 'thread_read',
                totalTokens: 0,
                feature: 'view-thread',
                meta: { threadId }
            });
        } catch (err) {
            console.error('Failed to log thread_read:', err);
        }

        res.json({ threadId, messages: simpleMessages });

    } catch (error) {
        console.error('Failed to fetch Gmail thread:', error);
        res.status(500).json({ error: 'Failed to fetch thread' });
    }
});
// POST /api/gmail/send/reply
// Sends a reply to an existing thread
router.post('/send/reply', auth, checkTokens(0, true), async (req, res) => {
    try {
        const { threadId, body, to, subject } = req.body;

        if (!threadId || !body) {
            return res.status(400).json({ error: 'Thread ID and body are required' });
        }

        const user = await User.findById(req.user.id).select('+googleAccessToken +gmailRefreshToken +googleTokenExpiry');
        if (!user || !user.googleAccessToken) {
            return res.status(401).json({ error: 'Gmail not connected' });
        }

        const client = getOAuthClient();
        setUserCredentials(client, user);
        const gmail = google.gmail({ version: 'v1', auth: client });

        // 1. Fetch the last message in the thread to get Message-ID for threading headers
        const threadDetails = await gmail.users.threads.get({
            userId: 'me',
            id: threadId,
            format: 'metadata',
            metadataHeaders: ['Message-ID', 'Subject', 'References']
        });

        const messages = threadDetails.data.messages || [];
        const lastMessage = messages[messages.length - 1];

        if (!lastMessage) {
            return res.status(404).json({ error: 'Thread not found or empty' });
        }

        const lastMsgHeaders = lastMessage.payload.headers;
        const messageId = lastMsgHeaders.find(h => h.name === 'Message-ID')?.value;
        const references = lastMsgHeaders.find(h => h.name === 'References')?.value || '';

        // 2. Construct MIME message
        // Important: In-Reply-To and References are critical for threading
        const newReferences = references ? `${references} ${messageId}` : messageId;

        const emailLines = [];
        emailLines.push(`To: ${to}`); // Should be original sender
        emailLines.push(`Subject: ${subject}`); // Should match existing subject (e.g. Re: ...)
        emailLines.push(`In-Reply-To: ${messageId}`);
        emailLines.push(`References: ${newReferences}`);
        emailLines.push('Content-Type: text/plain; charset=utf-8');
        emailLines.push('MIME-Version: 1.0');
        emailLines.push('');
        emailLines.push(body);

        const email = emailLines.join('\r\n');
        const encodedEmail = Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

        // 3. Send
        const response = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedEmail,
                threadId: threadId // Explicitly link to thread
            }
        });

        console.log(`[Gmail] Reply sent to thread ${threadId}`);
        try {
            const { logAnalyticEvent } = await import('../utils/analyticEvents.js');
            await logAnalyticEvent({
                userId: req.user.id,
                eventType: 'email_sent',
                totalTokens: 0,
                feature: 'gmail-send-reply',
                meta: { threadId }
            });
        } catch (e) { /* no-op */ }
        await deductTokens(req.user.id, 0, true);
        res.json({ id: response.data.id, threadId: response.data.threadId });

    } catch (error) {
        console.error('Failed to send Gmail reply:', error);
        res.status(500).json({
            error: 'Failed to send reply',
            details: error?.message || String(error)
        });
    }
});

// POST /api/gmail/send/new
// Sends a new email
router.post('/send/new', auth, checkTokens(0, true), async (req, res) => {
    try {
        const { to, subject, body, conversationId } = req.body;

        if (!to || !subject || !body) {
            return res.status(400).json({ error: 'To, Subject, and Body are required' });
        }

        const user = await User.findById(req.user.id).select('+googleAccessToken +gmailRefreshToken +googleTokenExpiry');
        if (!user || !user.googleAccessToken) {
            return res.status(401).json({ error: 'Gmail not connected' });
        }

        const client = getOAuthClient();
        setUserCredentials(client, user);
        const gmail = google.gmail({ version: 'v1', auth: client });

        // Construct MIME message
        const emailLines = [];
        emailLines.push(`To: ${to}`);
        emailLines.push(`Subject: ${subject}`);
        emailLines.push('Content-Type: text/plain; charset=utf-8');
        emailLines.push('MIME-Version: 1.0');
        emailLines.push('');
        emailLines.push(body);

        const email = emailLines.join('\r\n');
        const encodedEmail = Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

        const response = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedEmail
            }
        });

        console.log(`[Gmail] New email sent to ${to}`);

        try {
            const SentEmail = (await import('../models/SentEmail.js')).default;
            const safeConvId = conversationId && mongoose.Types.ObjectId.isValid(conversationId) && String(conversationId).length === 24
                ? conversationId
                : null;
            await SentEmail.create({
                userId: req.user.id,
                conversationId: safeConvId,
                provider: 'gmail',
                to,
                subject,
                body,
                threadId: response.data.threadId,
                mode: 'new',
                meta: {}
            });
        } catch (e) {
            console.warn('Failed to log SentEmail:', e.message);
        }

        try {
            const { logAnalyticEvent } = await import('../utils/analyticEvents.js');
            await logAnalyticEvent({
                userId: req.user.id,
                eventType: 'email_sent',
                totalTokens: 0,
                feature: 'gmail-send-new',
                meta: { to, threadId: response.data.threadId }
            });
        } catch (e) { /* no-op */ }

        await deductTokens(req.user.id, 0, true);
        res.json({ id: response.data.id, threadId: response.data.threadId });

    } catch (error) {
        console.error('Failed to send new Gmail:', error);
        res.status(500).json({
            error: 'Failed to send email',
            details: error?.message || String(error)
        });
    }
});


export default router;
