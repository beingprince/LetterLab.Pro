import express from 'express';
import { outlookClient } from '../emailClients.js';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';
import { checkTokens, deductTokens } from '../middleware/tokenMiddleware.js';

const router = express.Router();

// GET /api/outlook/status
router.get('/status', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('+outlookAccessToken +outlookTokenExpiry');

        if (!user || !user.outlookAccessToken) {
            return res.json({ connected: false });
        }

        // Check expiry
        if (user.outlookTokenExpiry && new Date() > user.outlookTokenExpiry) {
            return res.json({ connected: false, reason: 'expired' });
        }

        // Verify the token is valid by making a simple call
        const client = outlookClient(user.outlookAccessToken);
        await client.api('/me').get();

        res.json({ connected: true });
    } catch (error) {
        console.error('Outlook status check failed:', error.message);
        res.json({ connected: false });
    }
});

// GET /api/outlook/threads/by-professor
router.get('/threads/by-professor', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('+outlookAccessToken');
        if (!user || !user.outlookAccessToken) {
            return res.status(401).json({ error: 'Outlook not connected' });
        }

        const professorEmail = req.query.email;
        if (!professorEmail) {
            return res.status(400).json({ error: 'Professor email is required' });
        }

        const client = outlookClient(user.outlookAccessToken);

        // Search for messages with this professor using $search which is more robust
        // search syntax: "participants:email" or just the email to find mentions
        // We need 'ConsistencyLevel': 'eventual' header for $search

        const response = await client.api('/me/messages')
            .header('ConsistencyLevel', 'eventual')
            .search(`"${professorEmail}"`) // Search for the email string anywhere (from, to, body) - simpler and effective
            .select('conversationId,subject,bodyPreview,from,toRecipients,receivedDateTime,isRead')
            .top(50)
            .get();

        const messages = response.value || [];

        // Group messages by conversationId to create threads
        const threadsMap = new Map();

        messages.forEach(msg => {
            const convId = msg.conversationId;
            if (!threadsMap.has(convId)) {
                threadsMap.set(convId, {
                    id: convId,
                    subject: msg.subject || '(No Subject)',
                    snippet: msg.bodyPreview || '',
                    participants: new Set(),
                    messages: [],
                    lastMessageDate: msg.receivedDateTime,
                    unread: msg.isRead === false
                });
            }

            const thread = threadsMap.get(convId);
            thread.messages.push(msg);

            // Add participants
            if (msg.from?.emailAddress?.address) {
                thread.participants.add(msg.from.emailAddress.address);
            }
            msg.toRecipients?.forEach(recipient => {
                if (recipient.emailAddress?.address) {
                    thread.participants.add(recipient.emailAddress.address);
                }
            });

            // Update last message date if this message is newer
            if (new Date(msg.receivedDateTime) > new Date(thread.lastMessageDate)) {
                thread.lastMessageDate = msg.receivedDateTime;
            }

            // Update unread status
            if (msg.isRead === false) {
                thread.unread = true;
            }
        });

        // Convert threads map to array and format
        const threads = Array.from(threadsMap.values()).map(thread => ({
            id: thread.id,
            subject: thread.subject,
            snippet: thread.snippet,
            participants: Array.from(thread.participants),
            lastMessageDate: thread.lastMessageDate,
            messageCount: thread.messages.length,
            unread: thread.unread
        }));

        // Sort by last message date (newest first)
        threads.sort((a, b) => new Date(b.lastMessageDate) - new Date(a.lastMessageDate));

        res.json({ threads: threads.slice(0, 20) }); // Return top 20 threads

    } catch (error) {
        console.error('Failed to fetch Outlook threads:', error);
        res.status(500).json({ error: 'Failed to fetch threads' });
    }
});

// GET /api/outlook/threads/:id
// Note: Outlook IDs can be very long and contain special characters.
// Using a wildcard (*) or just :id usually works if the client encodes it properly.
// We'll add robust decoding here.
router.get('/threads/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('+outlookAccessToken');
        if (!user || !user.outlookAccessToken) {
            return res.status(401).json({ error: 'Outlook not connected' });
        }

        // Decode the ID in case it was double encoded or had special chars
        const threadId = decodeURIComponent(req.params.id);
        console.log(`[Outlook] Fetching thread: ${threadId}`);

        const client = outlookClient(user.outlookAccessToken);

        // Fetch messages with this conversationId
        // Simplify the query: remove orderby/filtering complexity on the server
        // and add consistency header to be safe, though consistency level is mainly for $search
        const response = await client.api('/me/messages')
            .header('ConsistencyLevel', 'eventual')
            .filter(`conversationId eq '${threadId}'`)
            .select('subject,bodyPreview,body,from,toRecipients,receivedDateTime')
            .top(50)
            .get();

        const messages = response.value || [];

        if (messages.length === 0) {
            console.log(`[Outlook] No messages found for thread: ${threadId}`);
            return res.status(404).json({ error: 'Thread not found' });
        }

        // Sort in memory to avoid "InefficientFilter" Graph API errors
        messages.sort((a, b) => new Date(a.receivedDateTime) - new Date(b.receivedDateTime));

        const formattedMessages = messages.map(msg => ({
            id: msg.id,
            subject: msg.subject,
            from: msg.from?.emailAddress?.name ? `"${msg.from.emailAddress.name}" <${msg.from.emailAddress.address}>` : msg.from?.emailAddress?.address || 'Unknown',
            to: msg.toRecipients?.map(r => r.emailAddress?.address).join(', '),
            date: msg.receivedDateTime,
            snippet: msg.bodyPreview,
            body: msg.body?.content || ''
        }));

        res.json({
            id: threadId,
            messages: formattedMessages
        });

    } catch (error) {
        console.error('Failed to fetch Outlook thread details:', error);
        res.status(500).json({ error: 'Failed to fetch thread details' });
    }
});


// POST /api/outlook/send/reply
// Sends a reply to an existing thread (conversation)
router.post('/send/reply', auth, checkTokens(0, true), async (req, res) => {
    try {
        console.log('👉 [Outlook] Received Reply Request');
        const { threadId, body, to } = req.body; // threadId here is conversationId

        if (!threadId || !body) {
            return res.status(400).json({ error: 'Thread ID and body are required' });
        }

        const safeThreadId = threadId.trim();
        console.log(`[Outlook] Attempting reply to Conversation ID: "${safeThreadId}"`);

        const user = await User.findById(req.user.id).select('+outlookAccessToken');
        if (!user || !user.outlookAccessToken) {
            return res.status(401).json({ error: 'Outlook not connected' });
        }

        const client = outlookClient(user.outlookAccessToken);

        // 1. Get messages in the conversation
        console.log(`[Outlook] Searching for messages directly via filter...`);
        let messages = [];

        try {
            const response = await client.api('/me/messages')
                .header('ConsistencyLevel', 'eventual')
                .filter(`conversationId eq '${safeThreadId}'`)
                .select('id,receivedDateTime,conversationId,isDraft,from,toRecipients')
                .top(50)
                .get();
            messages = response.value || [];
        } catch (e) {
            console.warn(`[Outlook] Direct filter failed: ${e.message}. Trying fallback search...`);
        }

        console.log(`[Outlook] Direct filter found ${messages.length} messages.`);

        // FALLBACK: If direct filter finds nothing (OData quirk?), try searching by recipient if available
        if (messages.length === 0 && to) {
            console.log(`[Outlook] Attempting fallback search by recipient: ${to}`);
            try {
                // Search for the recipient (like useFetchThreads does)
                const searchResponse = await client.api('/me/messages')
                    .header('ConsistencyLevel', 'eventual')
                    .search(`"${to}"`)
                    .select('id,receivedDateTime,conversationId,isDraft')
                    .top(50)
                    .get();

                const potentiallyRelated = searchResponse.value || [];
                // Filter in memory for the correct conversation ID
                const exactMatches = potentiallyRelated.filter(m => m.conversationId === safeThreadId);
                console.log(`[Outlook] Fallback search found ${potentiallyRelated.length} items, ${exactMatches.length} matching conversation ID.`);

                if (exactMatches.length > 0) {
                    messages = exactMatches;
                }
            } catch (fallbackErr) {
                console.error(`[Outlook] Fallback search failed:`, fallbackErr);
            }
        }

        if (messages.length === 0) {
            console.warn(`[Outlook] Conversation not found after fallback: ${safeThreadId}`);
            return res.status(404).json({ error: 'Conversation not found. It may have been deleted or moved.' });
        }

        // Filter out drafts in memory
        const validMessages = messages.filter(m => m.isDraft !== true);
        console.log(`[Outlook] Found ${validMessages.length} valid (non-draft) messages.`);

        if (validMessages.length === 0) {
            console.warn(`[Outlook] No valid non-draft messages found to reply to. Attempting 'Soft Reply' (New Email)...`);

            // Fallback: Send a new email to the conversation participants
            // We can use the draft's subject and recipients
            const draft = messages[0];
            const originalSubject = draft.subject || '';
            const replySubject = originalSubject.toLowerCase().startsWith('re:') ? originalSubject : `Re: ${originalSubject}`;

            // Gather recipients from the draft (combining to/cc if needed, but for now just to)
            // If 'to' was passed in body, use that. Otherwise try to infer from draft (which might be the professor)
            // But wait, if it's a draft *I* wrote, the recipients are who I was writing to.

            // Use the 'to' provided in the request if available, otherwise fallback to draft's recipients
            // Note: The draft might not have recipients if it was just started.

            let targetEmail = to;
            if (!targetEmail && draft.toRecipients && draft.toRecipients.length > 0) {
                targetEmail = draft.toRecipients[0].emailAddress.address;
            }

            if (!targetEmail) {
                return res.status(400).json({ error: 'Cannot reply: No recipients found in thread.' });
            }

            console.log(`[Outlook] Soft Reply -> Sending new mail to ${targetEmail} with subject: "${replySubject}"`);

            const message = {
                subject: replySubject,
                body: {
                    contentType: 'Text',
                    content: body
                },
                toRecipients: [
                    {
                        emailAddress: {
                            address: targetEmail
                        }
                    }
                ]
            };

            await client.api('/me/sendMail')
                .post({ message });

            console.log(`[Outlook] Soft Reply sent successfully.`);
            return res.json({ success: true, threadId, method: 'soft-reply' });
        }

        // Standard Reply Logic (for threads with non-drafts)
        // Sort in memory to get the latest message (descending order)
        validMessages.sort((a, b) => new Date(b.receivedDateTime) - new Date(a.receivedDateTime));

        const latestMessageId = validMessages[0].id;
        console.log(`[Outlook] Found latest valid message: ${latestMessageId} (${validMessages[0].receivedDateTime}). Sending reply...`);

        // 2. Create Reply Draft (instead of sending immediately)
        // This creation step links it to the thread automatically.
        const draft = await client.api(`/me/messages/${latestMessageId}/createReply`)
            .post(); // Returns the created draft message object

        const draftId = draft.id;
        console.log(`[Outlook] Created reply draft: ${draftId}`);

        // 3. Update Draft with Correct Recipient & Body
        // We explicitly overwrite toRecipients to ensure it goes to the professor, not back to the user
        const updatePayload = {
            body: {
                contentType: 'Text',
                content: body
            }
        };

        if (to) {
            updatePayload.toRecipients = [
                {
                    emailAddress: {
                        address: to
                    }
                }
            ];
            console.log(`[Outlook] Updating draft recipients to: ${to}`);
        }

        await client.api(`/me/messages/${draftId}`)
            .patch(updatePayload);

        // 4. Send the Draft
        await client.api(`/me/messages/${draftId}/send`)
            .post();

        console.log(`[Outlook] Reply sent successfully to conversation ${threadId}`);
        try {
            const { logAnalyticEvent } = await import('../utils/analyticEvents.js');
            await logAnalyticEvent({
                userId: req.user.id,
                eventType: 'email_sent',
                totalTokens: 0,
                feature: 'outlook-send-reply',
                meta: { threadId }
            });
        } catch (e) { /* no-op */ }
        await deductTokens(req.user.id, 0, true);
        res.json({ success: true, threadId });

    } catch (error) {
        console.error('Failed to send Outlook reply:', error);

        let errorDetails = error.message;
        if (error.body) {
            try {
                const bodyObj = JSON.parse(error.body);
                console.error('Graph API Error Body:', JSON.stringify(bodyObj, null, 2));
                errorDetails = JSON.stringify(bodyObj);
            } catch (e) {
                console.error('Raw Graph API Error Body:', error.body);
                errorDetails = error.body;
            }
        }

        res.status(500).json({ error: 'Failed to send reply', details: errorDetails });
    }
});

// POST /api/outlook/send/new
// Sends a new email
router.post('/send/new', auth, checkTokens(0, true), async (req, res) => {
    try {
        const { to, subject, body, conversationId } = req.body;

        if (!to || !subject || !body) {
            return res.status(400).json({ error: 'To, Subject, and Body are required' });
        }

        const user = await User.findById(req.user.id).select('+outlookAccessToken');
        if (!user || !user.outlookAccessToken) {
            return res.status(401).json({ error: 'Outlook not connected' });
        }

        const client = outlookClient(user.outlookAccessToken);

        // Construct message object
        const message = {
            subject: subject,
            body: {
                contentType: 'Text',
                content: body
            },
            toRecipients: [
                {
                    emailAddress: {
                        address: to
                    }
                }
            ]
        };

        await client.api('/me/sendMail')
            .post({ message });

        console.log(`[Outlook] New email sent to ${to}`);

        try {
            const SentEmail = (await import('../models/SentEmail.js')).default;
            await SentEmail.create({
                userId: req.user.id,
                conversationId: conversationId || null,
                provider: 'outlook',
                to,
                subject,
                body,
                threadId: null,
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
                feature: 'outlook-send-new',
                meta: { to }
            });
        } catch (e) { /* no-op */ }

        await deductTokens(req.user.id, 0, true);
        res.json({ success: true });

    } catch (error) {
        console.error('Failed to send new Outlook email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

export default router;
