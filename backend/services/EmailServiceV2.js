
import fs from 'fs';
import { outlookClient } from '../emailClients.js';
import { analyzeContext, sanitizeText } from '../utils/gemini.js';
import { deductTokens } from '../middleware/tokenMiddleware.js';

console.log("🚀 EmailServiceV2 Loaded! (New Logic - ROBUST MATCH - v7 - DEBUG FILES)");

// Helper function to get authenticated client (assuming outlookClient is renamed or wrapped)
// This function is added based on the provided instruction snippet.
function getAuthenticatedClient(accessToken) {
    if (!accessToken) throw new Error("Access Token is missing.");
    return outlookClient(accessToken);
}


// Helper to strip HTML tags for clean text
function stripHtml(html) {
    if (!html) return "";
    return html
        .replace(/<style([\s\S]*?)<\/style>/gi, '')
        .replace(/<script([\s\S]*?)<\/script>/gi, '')
        .replace(/<\/?[^>]+(>|$)/g, "")
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

// Helper to normalize Base64URL to Standard Base64 (moved to global scope for new logic)
const normalizeId = (id) => id.replace(/-/g, '+').replace(/_/g, '/');

export async function analyzeThreadContext(accessToken, conversationId, userId) {
    console.log(`\n🧠 [V2] Fetching thread: ${conversationId.substring(0, 20)}...`);

    const client = getAuthenticatedClient(accessToken);

    // Clean input
    conversationId = conversationId.trim();

    // 🔹 Strategy 0: Resolve Actual Conversation ID from Message ID
    try {
        const msg = await client.api(`/me/messages/${conversationId}`)
            .select('conversationId')
            .get();
        if (msg.conversationId && msg.conversationId !== conversationId) {
            console.log(`✅ Strategy 0: Resolved Message ID -> Conversation ID`);
            conversationId = msg.conversationId;
        }
    } catch (e) { /* Ignore */ }

    // 🔹 Strategy 1: Fetch Messages
    // We use the standard ID now (Header removed)
    let messages = [];
    try {
        const response = await client.api('/me/messages')
            .filter(`conversationId eq '${conversationId}'`)
            .select('body,from,receivedDateTime,subject,conversationId,isRead')
            .top(50)
            .get();
        messages = response.value;
    } catch (err) {
        console.log(`⚠️ Primary Fetch Failed: ${err.message}`);
    }

    // 🔹 Strategy 2: Fuzzy Match (Fallback)
    if (!messages || messages.length === 0) {
        console.log(`🔹 Strategy 2: Fuzzy Scan...`);
        try {
            const recent = await client.api('/me/messages')
                .top(50)
                .select('body,from,receivedDateTime,subject,conversationId')
                .get();

            const targetNorm = normalizeId(conversationId).substring(4); // Ignore prefix
            messages = recent.value.filter(m =>
                normalizeId(m.conversationId).substring(4) === targetNorm
            );
        } catch (e) {
            console.log(`⚠️ Strategy 2 Failed: ${e.message}`);
        }
    }

    if (messages.length === 0) {
        return { emails: [], subject: "No messages found" };
    }

    // Sort Chronologically
    messages.sort((a, b) => new Date(a.receivedDateTime) - new Date(b.receivedDateTime));

    // Prepare Data
    const subject = messages[0].subject;
    const emailData = messages.map(m => {
        const cleanBody = stripHtml(m.body.content || m.bodyPreview || "");
        return {
            from: m.from?.emailAddress?.name || m.from?.emailAddress?.address || "Unknown",
            date: m.receivedDateTime,
            preview: cleanBody, // Clean text for UI
            originalBody: m.body.content // Keep if needed? No, saves bandwidth
        };
    });

    // 🔹 Optimization: Context for Gemini
    // Limit to last 5 messages to save tokens? Or stripped content is enough?
    // 7000 chars was too much. Stripped text should be ~2000.
    const fullContext = emailData.map(e =>
        `From: ${e.from}\nDate: ${e.date}\nContent: ${e.preview}\n---`
    ).join('\n');

    let analysis = null;
    try {
        console.log(`🧠 Sending Prompt (Length: ${fullContext.length})...`);
        analysis = await analyzeContext(fullContext);
    } catch (geminiErr) {
        console.error("⚠️ Gemini Analysis Failed (Quota or Error):", geminiErr.message);
    }

    // Check if analysis is null (due to try/catch above OR internal catch in analyzeContext)
    if (!analysis) {
        analysis = {
            summary: "AI Analysis Unavailable (Quota Exceeded). Please check billing.",
            action_required: false,
            sentiment: "Neutral"
        };
    }

    if (userId) {
        // rough token tracking
        await deductTokens(userId, Math.ceil(fullContext.length / 4));
    }

    return { ...analysis, emails: emailData };
}
