import { outlookClient } from '../emailClients.js';
import { summarizeContext, analyzeContext, sanitizeText, generateEmailDraft as generateEmailDraftGemini } from '../utils/gemini.js';
import { deductTokens } from '../middleware/tokenMiddleware.js';

/**
 * @deprecated
 */
export async function pullSubjectsWithAccessToken(accessToken, targetEmail, currentUserEmail) {
    console.warn("DEPRECATED: pullSubjectsWithAccessToken is called. Use listThreads and getAndSummarizeThreads instead.");
    throw new Error("This function is deprecated.");
}

/**
 * Lists unique conversation threads for the selection UI.
 */
export async function listThreads(accessToken, targetEmail) {
    console.log(`\n🔍 Listing threads for: ${targetEmail}`);
    if (!accessToken) {
        throw new Error("Access Token is missing for Graph API call.");
    }

    const client = outlookClient(accessToken);

    try {
        console.log('📧 Querying Microsoft Graph API for threads...');

        // Simple filter without orderby to avoid "too complex" errors
        const filterQuery = `from/emailAddress/address eq '${targetEmail}'`;

        const response = await client.api('/me/messages')
            //.header('Prefer', 'IdType="ImmutableId"') // REVERTED: Using standard Rest IDs to fix filtering issues
            .filter(filterQuery)
            .select('subject,sender,receivedDateTime,conversationId')
            .top(50)
            .get();

        const messages = response.value || [];
        console.log(`✅ Found ${messages.length} raw messages`);

        // Sort messages by date (newest first) in code
        messages.sort((a, b) => new Date(b.receivedDateTime) - new Date(a.receivedDateTime));

        // Group by conversationId to get unique threads
        const threads = messages.reduce((acc, msg) => {
            if (msg.conversationId && !acc[msg.conversationId]) {
                acc[msg.conversationId] = {
                    id: msg.conversationId,
                    subject: msg.subject || '(No Subject)',
                    latestDate: msg.receivedDateTime,
                    senderAddress: msg.sender?.emailAddress?.address,
                };
            }
            return acc;
        }, {});

        const uniqueThreads = Object.values(threads);
        console.log(`✅ Found ${uniqueThreads.length} unique conversation threads.`);
        return uniqueThreads;

    } catch (error) {
        console.error('❌ Error in listThreads:', error);
        throw error;
    }
}

/**
 * NEW: Fetches full thread context and performs specific analysis (Sender, Tone, etc.)
 */
export async function analyzeThreadContext(accessToken, conversationId, userId, userEmail, userName) {
    console.log(`\n🧠 Analyzing thread: ${conversationId}`);
    if (!accessToken) throw new Error("Access Token is missing.");

    const client = outlookClient(accessToken);
    let fullContext = "";

    try {
        // Fetch all messages in the conversation
        // FIX: Convert Base64URL characters to standard Base64 for OData filter
        const validId = conversationId.replace(/-/g, '+').replace(/_/g, '/');
        console.log(`🔍 Filter ID (Sanitized): ${validId}`);

        const response = await client.api('/me/messages')
            .filter(`conversationId eq '${validId}'`)
            .select('body,from,receivedDateTime,sender')
            .get();

        const messages = response.value || [];
        // Sort oldest to newest for chronological context
        messages.sort((a, b) => new Date(a.receivedDateTime) - new Date(b.receivedDateTime));

        messages.forEach(msg => {
            const senderAddress = msg.from?.emailAddress?.address?.toLowerCase();
            const myAddress = userEmail?.toLowerCase();

            let fromLabel = `FROM: ${msg.from?.emailAddress?.address}`;

            if (senderAddress && myAddress && senderAddress === myAddress) {
                fromLabel = `FROM: Me (${userName || 'Student'})`;
            } else {
                const name = msg.from?.emailAddress?.name || 'Unknown';
                fromLabel = `FROM: Professor/Other (${name})`;
            }

            fullContext += `\n---EMAIL---\n${fromLabel}\nDATE: ${msg.receivedDateTime}\nBODY:\n${sanitizeText(msg.body.content, 5000)}\n`;
        });

        const analysis = await analyzeContext(fullContext);

        // Enhance analysis with actual email data
        // Assumes the first message "FROM" is the other person if we are replying, or generally captures the sender.
        const professorEmail = messages.find(m => m.from?.emailAddress?.address)?.from?.emailAddress?.address;

        // Track usage (Estimation)
        if (userId && fullContext.length > 0) {
            const tokens = Math.ceil(fullContext.length / 4);
            await deductTokens(userId, tokens);
        }

        return { ...analysis, professorEmail };

    } catch (error) {
        console.error('❌ Error in analyzeThreadContext:', error);
        throw error;
    }
}


/**
 * Fetches full email bodies for selected threads and summarizes them.
 */
export async function getAndSummarizeThreads(accessToken, conversationIds, userId) {
    console.log(`\n📚 Summarizing ${conversationIds.length} thread(s)`);
    if (!accessToken) {
        throw new Error("Access Token is missing for Graph API call.");
    }

    const client = outlookClient(accessToken);
    let fullContext = "";

    try {
        for (const id of conversationIds) {
            const response = await client.api('/me/messages')
                .filter(`conversationId eq '${id}'`)
                .select('body,from,receivedDateTime')
                .get();

            const messages = response.value || [];

            // Sort in code instead of using orderby
            messages.sort((a, b) => new Date(a.receivedDateTime) - new Date(b.receivedDateTime));

            fullContext += `\n\n--- THREAD START (ID: ${id}) ---\n`;

            for (const msg of messages) {
                fullContext += `\n---EMAIL---\nFROM: ${msg.from?.emailAddress?.address}\nDATE: ${msg.receivedDateTime}\nBODY:\n${sanitizeText(msg.body.content, 5000)}\n`;
            }
        }

        console.log(`✅ Context fetched. Total characters: ${fullContext.length}`);

        const summary = await summarizeContext(fullContext);

        console.log(`✅ Summary complete.`);

        // Track usage for summarization
        if (userId) {
            const inputTokens = Math.ceil(fullContext.length / 4);
            const outputTokens = Math.ceil(summary.length / 4);
            const totalTokens = inputTokens + outputTokens;

            await deductTokens(userId, totalTokens);
        }

        return {
            summary: summary,
        };

    } catch (error) {
        console.error('❌ Error in getAndSummarizeThreads:', error);
        throw error;
    }
}

/**
 * Generates an email draft and tracks usage.
 */
export async function generateEmailDraft(params, userId) {
    try {
        const draft = await generateEmailDraftGemini(params);

        // Track usage for email generation
        if (userId) {
            const { notes, context } = params;
            const inputText = (notes || '') + (context || '');
            const inputTokens = Math.ceil(inputText.length / 4);
            const outputTokens = Math.ceil(draft.length / 4);
            const totalTokens = inputTokens + outputTokens;

            await deductTokens(userId, totalTokens);
        }

        return draft;
    } catch (error) {
        console.error('❌ Error in generateEmailDraft service:', error);
        throw error;
    }
}