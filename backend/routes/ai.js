// backend/routes/ai.js
// AI-powered email generation and analysis endpoints using Gemini API with OpenAI fallback

import express from 'express';
import mongoose from 'mongoose';
import { auth } from '../middleware/auth.js';
import User from '../models/User.js';
import { logAnalyticEvent } from '../utils/analyticEvents.js';
import { generateText, generateTextAsJson } from '../services/aiGateway.js';
import Conversation from '../models/Conversation.js';
import DocumentBlock from '../models/DocumentBlock.js';
import { checkTokens, deductTokens, TOKEN_COSTS, calculateResetTime } from '../middleware/tokenMiddleware.js';

const router = express.Router();
const MAX_HISTORY_MESSAGES = 8;

const safeLog = async (opts) => {
    if (typeof logAnalyticEvent === 'function') {
        try { await logAnalyticEvent(opts); } catch (e) { console.warn('[logAnalyticEvent]', e?.message); }
    }
};

/**
 * POST /api/ai/chat
 * Chat-only mode: modes chat | email_draft. Structured JSON response.
 * Quota enforced; conversation persisted server-side.
 */
router.post('/chat', auth, async (req, res) => {
    try {
        const { messages, conversation_id: conversationId, mode = 'chat', document_id: documentId } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid messages format' });
        }

        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const user = await User.findById(userId).select('+chatTokensLimit +chatTokensRemaining +emailsRemainingToday +emailsLimitDaily +nextResetAt +plan +defaultTone +defaultSignature');

        // Note: We use in-route checks here because mode (chat vs draft) is dynamic 
        // per request body, but for simple chat we check base cost:
        const baseCost = TOKEN_COSTS.SIMPLE_QUERY;
        if (user.chatTokensRemaining < baseCost && user.plan !== 'pro') {
            return res.status(429).json({
                error: 'Quota exhausted',
                reset_at: user.nextResetAt,
                reset_in: calculateResetTime(user.nextResetAt)
            });
        }

        // 2. Load or create conversation
        const validConvId = conversationId && mongoose.Types.ObjectId.isValid(conversationId) && conversationId.length === 24;
        let conv = validConvId
            ? await Conversation.findOne({ _id: conversationId, userId })
            : null;
        if (!conv) {
            conv = await Conversation.create({ userId, messages: [] });
        }

        const lastUserMsg = messages.filter(m => m.role === 'user').pop()?.content || '';
        const lastUserLower = lastUserMsg.toLowerCase();
        const draftKeywords = ['draft', 'write', 'ready', 'fix', 'generate', 'create', 'make', 'compose', 'email', 'reply'];
        const isDraftIntent = req.body.mode === 'email_draft' || draftKeywords.some(k => lastUserLower.includes(k));

        // 2b. Email quota check when generating draft
        if (isDraftIntent) {
            if (user.emailsRemainingToday < 1 && user.plan !== 'pro') {
                return res.status(429).json({
                    error: 'Email quota exceeded',
                    reset_at: user.nextResetAt
                });
            }
        }

        const messagesForHistory = (conv.messages || []).slice(-MAX_HISTORY_MESSAGES);
        const history = messagesForHistory.map(m => `${m.role === 'user' ? 'Student' : 'LetterLab'}: ${m.content}`).join('\n');

        const isGreeting = /^(hi|hey|hello|yo|sup|good\s+(morning|afternoon|evening)|what'?s\s+up)\b/i.test(lastUserLower) && lastUserLower.length < 80;

        const professorName = conv.professorName || '';
        const recipientEmail = conv.recipientEmail || '';

        // ── RAG: Optional Document Context ──
        let documentContext = '';
        if (documentId && mongoose.Types.ObjectId.isValid(documentId)) {
            const blocks = await DocumentBlock.find({ document_id: documentId })
                .sort({ block_index_global: 1 })
                .lean();
            
            if (blocks.length > 0) {
                documentContext = blocks
                    .map(b => `[Page ${b.page_number}] ${b.text}`)
                    .join('\n');
                console.log(`[RAG] Injected ${blocks.length} blocks from document: ${documentId}`);
            }
        }

        let systemInstruction = `You are LetterLab, an expert academic communication assistant. Be helpful and conversational.`;
        if (documentContext) {
            systemInstruction += `\n\nREFERENCE DOCUMENT CONTEXT:\n${documentContext}\n\nUse the information above to answer the student's questions if relevant. If the answer is not in the context, use your general knowledge but prioritize the document.`;
        }
        
        // Apply user's preferred tone
        const userTone = user.defaultTone || 'formal';
        systemInstruction += `\n\nYour writing style should be ${userTone}.`;

        if (professorName) {
            const lastName = professorName.split(/\s+/).pop() || professorName;
            const isDr = /^dr\.?\s/i.test(professorName);
            systemInstruction += ` When greeting, use "Hello ${isDr ? 'Dr.' : 'Professor'} ${lastName}," if appropriate.`;
        }
        systemInstruction += `\n\nExtract professor_name (e.g. "Professor Smith") and recipient_email if the user provides them. Return as JSON.`;

        const schemaHint = `Return JSON: { "assistant_text": "string", "draft_email": null or { "subject": "string", "body": "string" }, "professor_name": "string or null", "recipient_email": "string or null" }`;
        let prompt = `Conversation:\n${history}\n\nStudent: ${lastUserMsg}\n\nLetterLab:`;

        if (isGreeting) {
            prompt += `\n\nRespond with a friendly greeting only. Set draft_email to null.`;
        } else if (isDraftIntent) {
            prompt += `\n\nUSER WANTS TO DRAFT EMAIL. Generate an email draft in a ${userTone} tone. Populate draft_email with subject and body. Use professor/recipient from context if available.`;
            if (user.defaultSignature) {
                prompt += `\n\nAPPEND THIS SIGNATURE to the end of the email body exactly:\n${user.defaultSignature}`;
            }
        } else {
            prompt += `\n\nRespond helpfully. If the user provides a professor name or email, extract and return professor_name and recipient_email. Set draft_email to null unless they explicitly ask to write an email.`;
        }

        prompt += `\n\n${schemaHint}`;

        // Draft responses need more tokens for subject + body
        const maxTokens = isDraftIntent ? 1200 : 500;
        const result = await generateTextAsJson({
            purpose: 'chat',
            system: systemInstruction,
            prompt,
            temperature: 0.7,
            maxOutputTokens: maxTokens,
        });
        const parsed = result.parsed || {};
        const usage = result.usage || {};
        const inputTokens = usage.inputTokens ?? 0;
        const outputTokens = usage.outputTokens ?? 0;
        const totalTokens = usage.totalTokens ?? inputTokens + outputTokens;
        const provider = result.providerUsed;
        const model = result.modelUsed;

        const assistantText = parsed.assistant_text || parsed.message || '';
        const draftEmail = parsed.draft_email && (parsed.draft_email.subject !== undefined || parsed.draft_email.body) ? parsed.draft_email : null;

        if (draftEmail && isDraftIntent) {
            await deductTokens(userId, 0, true); // Deduct email credit
        }

        if (parsed.professor_name) conv.professorName = parsed.professor_name;
        if (parsed.recipient_email) conv.recipientEmail = parsed.recipient_email;

        conv.messages.push({ role: 'user', content: lastUserMsg });
        conv.messages.push({ role: 'assistant', content: assistantText });
        if (conv.messages.length > 50) conv.messages = conv.messages.slice(-50);
        await conv.save();

        await deductTokens(userId, totalTokens, false);

        await safeLog({
            userId,
            eventType: 'chat_turn',
            totalTokens,
            inputTokens,
            outputTokens,
            provider,
            model,
            feature: 'chat'
        });
        if (draftEmail && isDraftIntent) {
            await safeLog({
                userId,
                eventType: 'email_draft_created',
                totalTokens: 0,
                feature: 'chat-draft',
                meta: { source: 'chat' }
            });
        }

        res.json({
            assistant_text: assistantText,
            draft_email: draftEmail ?? null,
            warnings: [],
            providerUsed: provider,
            modelUsed: model,
            usage: { input_tokens: inputTokens, output_tokens: outputTokens, total_tokens: totalTokens },
            meta: {
                provider,
                model,
                conversation_id: conv._id.toString(),
                professor_name: conv.professorName || null,
                recipient_email: conv.recipientEmail || null,
                recipient_confirmed: conv.recipientConfirmed || false
            }
        });

    } catch (error) {
        console.error('❌ [POST /ai/chat]', error.message);
        res.status(500).json({
            error: 'Failed to process chat',
            details: error.message,
            assistant_text: '',
            draft_email: null,
            warnings: [],
        });
    }
});

/**
 * POST /api/ai/summarize-thread
 * Analyzes and summarizes email thread context
 */
router.post('/summarize-thread', auth, async (req, res) => {
    try {
        const { threads } = req.body;

        if (!threads || threads.length === 0) {
            return res.status(400).json({ error: 'No threads provided' });
        }

        // Build context from threads
        const threadContext = threads.map((thread, index) => `
Email ${index + 1}:
Subject: ${thread.subject || '(No Subject)'}
From: ${thread.from?.emailAddress?.name || 'Unknown'}
Date: ${thread.receivedDateTime}
Preview: ${thread.bodyPreview}
    `).join('\n---\n');

        const prompt = `Analyze the following email conversation thread and provide a concise, professional summary of the context, key topics discussed, and the overall tone of the conversation. Focus on what would be relevant for composing a follow-up email.

${threadContext}

Provide a 2-3 sentence summary that captures the essence of this conversation.`;

        const result = await generateText({
            purpose: 'summarize-thread',
            system: "You are a helpful executive assistant summarizing emails.",
            prompt,
            temperature: 0.7,
        });
        const summary = result.text;
        const tokensUsed = result.usage?.totalTokens ?? 0;

        if (req.user?.id) {
            await safeLog({
                userId: req.user.id,
                eventType: 'summary_generated',
                totalTokens: tokensUsed,
                feature: 'summarize-thread'
            });
        }

        console.log('✅ Thread summarized successfully');
        res.json({ summary });

    } catch (error) {
        console.error('❌ [POST /ai/summarize-thread]', error.message);
        res.status(500).json({ error: 'Failed to summarize thread', details: error.message });
    }
});

/**
 * POST /api/ai/generate-reply
 * Generates a reply continuing an existing email thread
 */
router.post('/generate-reply', auth, async (req, res) => {
    try {
        const { userInput, context, professor } = req.body;

        if (!userInput || !context) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const userId = req.user?.id;
        const user = await User.findById(userId).select('+emailsRemainingToday +emailsLimitDaily +nextResetAt +plan +defaultTone +defaultSignature');

        if (user.emailsRemainingToday < 1 && user.plan !== 'pro') {
            return res.status(429).json({
                error: 'Email quota exceeded',
                reset_at: user.nextResetAt,
                reset_in: calculateResetTime(user.nextResetAt)
            });
        }

        const prompt = `You are helping a student compose a professional email reply to their professor.

CONVERSATION CONTEXT:
${context}

PROFESSOR INFO:
Name: ${professor?.name || 'Unknown'}
Department: ${professor?.department || 'Unknown'}
Communication Style: ${professor?.communicationStyle || 'Professional'}

STUDENT'S INTENT:
${userInput}

Generate a professional, well-structured email that:
1. Maintains the conversation's tone and context
2. Addresses the student's intent clearly
3. Uses appropriate academic email etiquette
4. Is concise but complete (150-250 words)
5. Matches the professor's communication style
6. Follows a ${user.defaultTone || 'formal'} tone

DO NOT include subject line or greeting.
${user.defaultSignature ? `APPEND THE FOLLOWING SIGNATURE exactly at the end:\n${user.defaultSignature}` : 'DO NOT include a signature.'}`;

        const result = await generateText({
            purpose: 'generate-reply',
            system: "You are helping a student compose a professional email reply to their professor.",
            prompt,
            temperature: 0.7,
        });
        const draft = result.text;
        const tokensUsed = result.usage?.totalTokens ?? 0;

        // Deduct email credit
        await deductTokens(userId, 0, true);

        if (req.user?.id) {
            await safeLog({
                userId: req.user.id,
                eventType: 'email_draft_created',
                totalTokens: tokensUsed,
                provider: result.providerUsed,
                model: result.modelUsed,
                feature: 'generate-reply'
            });
        }

        const detectedTone = draft.toLowerCase().includes('urgent') || draft.toLowerCase().includes('apologize')
            ? 'formal'
            : 'professional';

        console.log('✅ Reply generated successfully');
        res.json({ draft, detectedTone });

    } catch (error) {
        console.error('❌ [POST /ai/generate-reply]', error.message);
        res.status(500).json({ error: 'Failed to generate reply', details: error.message });
    }
});

/**
 * POST /api/ai/generate-new
 * Generates a new email to a professor
 */
router.post('/generate-new', auth, async (req, res) => {
    try {
        const { userInput, professor } = req.body;

        if (!userInput) {
            return res.status(400).json({ error: 'Missing user input' });
        }

        const userId = req.user?.id;
        const user = await User.findById(userId).select('+emailsRemainingToday +emailsLimitDaily +nextResetAt +plan +defaultTone +defaultSignature');

        if (user.emailsRemainingToday < 1 && user.plan !== 'pro') {
            return res.status(429).json({
                error: 'Email quota exceeded',
                reset_at: user.nextResetAt,
                reset_in: calculateResetTime(user.nextResetAt)
            });
        }

        const prompt = `You are helping a student compose a professional email to their professor.

PROFESSOR INFO:
Name: ${professor?.name || 'Unknown'}
Department: ${professor?.department || 'Unknown'}
University: ${professor?.university || 'Unknown'}
Communication Style: ${professor?.communicationStyle || 'Professional'}

STUDENT'S REQUEST:
${userInput}

Generate a professional, well-structured email that:
1. Is respectful and appropriate for student-professor communication
2. Clearly states the purpose
3. Provides necessary context
4. Uses proper academic email etiquette
5. Is concise but complete (150-250 words)
6. Matches the professor's preferred communication style
7. Follows a ${user.defaultTone || 'formal'} tone

DO NOT include subject line or greeting.
${user.defaultSignature ? `APPEND THE FOLLOWING SIGNATURE exactly at the end:\n${user.defaultSignature}` : 'DO NOT include a signature.'}`;

        const result = await generateText({
            purpose: 'generate-new',
            system: "You are helping a student compose a professional email to their professor.",
            prompt,
            temperature: 0.7,
        });
        const draft = result.text;
        const tokensUsed = result.usage?.totalTokens ?? 0;

        // Deduct email credit
        await deductTokens(userId, 0, true);

        if (req.user?.id) {
            await safeLog({
                userId: req.user.id,
                eventType: 'email_draft_created',
                totalTokens: tokensUsed,
                provider: result.providerUsed,
                model: result.modelUsed,
                feature: 'generate-new'
            });
        }

        const detectedTone = draft.toLowerCase().includes('urgent') || draft.toLowerCase().includes('request')
            ? 'formal'
            : 'professional';

        console.log('✅ New email generated successfully');
        res.json({ draft, detectedTone });

    } catch (error) {
        console.error('❌ [POST /ai/generate-new]', error.message);
        res.status(500).json({ error: 'Failed to generate email', details: error.message });
    }
});

/** Reject any string that looks like JSON/key fragment — never show "subjects":[ etc. in UI */
function isSubjectLineValid(s) {
    if (typeof s !== 'string') return false;
    const t = s.trim();
    if (t.length < 5 || t.length > 90) return false;
    const lower = t.toLowerCase();
    if (lower.includes('subjects') || lower.includes('"subjects"')) return false;
    if (t.startsWith('{') || t.startsWith('[') || t.endsWith(':')) return false;
    if (t.includes('":') || /[{}[\]]/.test(t)) return false;
    return true;
}

/**
 * Extract subject lines from raw model text. Filters out JSON fragments and enforces 5–90 chars.
 * Returns only valid subject strings; if fewer than 3, returns [] so caller can error.
 */
function extractSubjectsFromResponse(parsed, rawText, count) {
    const cap = Math.min(Math.max(Number(count) || 5, 1), 10);
    const normalize = (s) => (typeof s === 'string' ? s : String(s)).trim();
    const filterValid = (arr) => arr.map(normalize).filter(Boolean).filter(isSubjectLineValid);

    if (Array.isArray(parsed?.subjects) && parsed.subjects.length > 0) {
        const out = filterValid(parsed.subjects).slice(0, cap);
        if (out.length >= 3) return out;
    }
    const raw = (rawText || '').replace(/```json\s?|\s?```/g, '').trim();
    try {
        const obj = JSON.parse(raw);
        const arr = obj?.subjects ?? obj?.subject_lines ?? obj?.suggestions;
        if (Array.isArray(arr) && arr.length > 0) {
            const out = filterValid(arr).slice(0, cap);
            if (out.length >= 3) return out;
        }
    } catch { /* ignore */ }
    const jsonLike = /subjects|[\{\}\[\]]|":/i;
    const lines = (raw || rawText || '')
        .split(/\n/)
        .map(l => l.replace(/^\s*[-*•]\s*|^\d+\.\s*/, '').trim())
        .filter(l => l.length >= 5 && l.length <= 90 && !jsonLike.test(l));
    const out = [...new Set(lines)].slice(0, cap);
    return out.length >= 3 ? out : [];
}

/**
 * POST /api/ai/generate-subjects
 * Generates N subject line suggestions based on email content
 * Contract: { subjects: string[] } on success; { error?: string, subjects: [] } on error
 */
router.post('/generate-subjects', auth, async (req, res) => {
    try {
        const { emailContent, professor, count = 5 } = req.body;

        const contentStr = emailContent == null
            ? ''
            : (typeof emailContent === 'string' ? emailContent : (emailContent?.body ?? JSON.stringify(emailContent)));
        const trimmed = (contentStr || '').trim();

        if (!trimmed) {
            return res.status(400).json({ error: 'Missing email content', subjects: [] });
        }

        const prompt = `You must return ONLY a JSON object. No other text, no markdown, no explanation.

Based on the email content below, generate exactly ${count} distinct subject lines that reflect the intent and context. Each subject must be:
- Clear, specific, and professional (academic communication)
- 5–90 characters
- Descriptive of the email's main purpose
- Different from each other (vary wording and angle)

Email content:
${trimmed}

Return ONLY this JSON object (nothing else):
{"subjects":["Subject 1","Subject 2","Subject 3","Subject 4","Subject 5"]}`;

        const result = await generateTextAsJson({
            purpose: 'generate-subjects',
            system: 'You are a professional academic email assistant. Return only valid JSON.',
            prompt,
            temperature: 0.7,
            maxOutputTokens: 500,
        });
        const parsed = result.parsed || {};
        const rawText = result.text || '';
        let subjects = extractSubjectsFromResponse(parsed, rawText, count);
        if (subjects.length < 3) {
            console.warn(`[generate-subjects] Fewer than 3 valid subjects after filtering (got ${subjects.length}); returning error`);
            return res.status(200).json({
                subjects: [],
                error: 'Could not extract enough subject lines. Please try again with different content.',
                providerUsed: result.providerUsed,
                modelUsed: result.modelUsed
            });
        }
        subjects = subjects.slice(0, count);
        const usage = result.usage || {};
        const totalTokens = usage.totalTokens ?? (usage.inputTokens || 0) + (usage.outputTokens || 0);

        if (req.user?.id) {
            await safeLog({
                userId: req.user.id,
                eventType: 'subject_generated',
                totalTokens,
                inputTokens: usage.inputTokens || 0,
                outputTokens: usage.outputTokens || 0,
                provider: result.providerUsed,
                model: result.modelUsed,
                feature: 'generate-subjects'
            });
        }

        console.log(`✅ ${subjects.length} Subject suggestions generated`);
        res.json({
            subjects,
            providerUsed: result.providerUsed,
            modelUsed: result.modelUsed,
            usage: { inputTokens: usage.inputTokens, outputTokens: usage.outputTokens, totalTokens }
        });

    } catch (error) {
        console.error('❌ [POST /api/ai/generate-subjects]', error.message);
        res.status(500).json({
            error: 'Failed to generate subjects',
            details: error.message,
            subjects: [],
        });
    }
});

/**
 * POST /api/ai/analyze-thread-structured
 * Analyzes email thread and returns structured JSON for Summary Page
 */
router.post('/analyze-thread-structured', auth, async (req, res) => {
    try {
        const { threadContent } = req.body;

        if (!threadContent) {
            return res.status(400).json({ error: 'Missing thread content' });
        }

        // Truncate to avoid massive tokens
        const threadString = JSON.stringify(threadContent).substring(0, 20000);

        const prompt = `Analyze the following email thread and provide a structured summary in valid JSON format.
        
        EMAIL THREAD:
        ${threadString}

        REQUIRED JSON STRUCTURE:
        {
            "threadSummary": "2-3 sentences summarizing the conversation context and current state.",
            "actionRequired": "One clear sentence stating exactly what the user needs to do next (e.g. 'Approve the budget by Friday').",
            "keyPoints": ["Bullet point 1", "Bullet point 2", "Bullet point 3"],
            "respondTo": ["Specific point to address in reply", "Another point to address"],
            "tone": { "sentiment": "professional|urgent|casual|frustrated", "confidence": 0.9 },
            "urgency": "high|medium|low",
            "deadline": { "text": "e.g. Reply by Friday 5PM" }, 
            "openQuestions": ["Question 1 needed to be answered", "Question 2"]
        }

        RULES:
        - "deadline" should be null if no specific deadline is found.
        - "urgency" should be inferred from dates/language.
        - "keyPoints" should be facts/decisions made.
        - "respondTo" should be strategic advice on what to say.
        - Return ONLY raw JSON.`;

        const result = await generateText({
            purpose: 'analyze-thread-structured',
            system: "You are an expert email analyst that outputs valid JSON.",
            prompt,
            temperature: 0.7,
            jsonMode: true,
            maxOutputTokens: 2000,
        });
        const responseText = result.text;
        const tokensUsed = result.usage?.totalTokens ?? 0;

        if (req.user?.id) {
            await safeLog({
                userId: req.user.id,
                eventType: 'thread_analyzed',
                totalTokens: tokensUsed,
                provider: result.providerUsed,
                model: result.modelUsed,
                feature: 'analyze-thread-structured'
            });
        }

        const cleanJson = (responseText || '').replace(/```json/g, '').replace(/```/g, '').trim();
        let jsonResponse;
        try {
            jsonResponse = JSON.parse(cleanJson || '{}');
        } catch {
            jsonResponse = { threadSummary: '', keyPoints: [], respondTo: [], openQuestions: [] };
        }

        console.log('✅ Thread analyzed successfully');
        res.json({
            ...jsonResponse,
            providerUsed: result.providerUsed,
            modelUsed: result.modelUsed,
            usage: result.usage,
        });

    } catch (error) {
        console.error('❌ [POST /api/ai/analyze-thread-structured]', error.message);
        res.status(500).json({
            error: 'Failed to analyze thread',
            details: error.message,
            threadSummary: '',
            keyPoints: [],
            respondTo: [],
            openQuestions: [],
        });
    }
});

export default router;
