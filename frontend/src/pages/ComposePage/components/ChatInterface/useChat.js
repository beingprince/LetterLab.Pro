import { useState, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Extract displayable text. If raw text looks like JSON with assistant_text, parse and unwrap.
 * Handles truncated JSON (e.g. { "assistant_text": "Absolutely) via regex fallback.
 */
function extractDisplayText(raw) {
    if (raw == null) return '';
    const str = typeof raw === 'string' ? raw : String(raw);
    const trimmed = str.trim();
    if (!trimmed.startsWith('{') || !trimmed.includes('assistant_text')) return str;
    try {
        const parsed = JSON.parse(trimmed);
        const inner = parsed?.assistant_text ?? parsed?.text ?? parsed?.message ?? parsed?.content ?? '';
        return typeof inner === 'string' ? inner : String(inner);
    } catch {
        // Truncated or malformed JSON – regex extract assistant_text value (closing quote optional)
        const m = trimmed.match(/"assistant_text"\s*:\s*"((?:[^"\\]|\\.)*)"?/);
        return m ? m[1].replace(/\\(.)/g, '$1') : str;
    }
}

/**
 * Normalize API chat response so chat bubble always shows human-readable text.
 * Supports new structured format and legacy delimiter-based replies.
 */
function normalizeChatResponse(data) {
    if (!data) return { text: '', draft_email: null, warnings: [], usage: null };
    if (typeof data === 'string') return { text: extractDisplayText(data), draft_email: null, warnings: [], usage: null };
    if (typeof data === 'object') {
        const raw = data.assistant_text ?? data.text ?? data.message ?? data.content ?? '';
        const text = extractDisplayText(raw);
        return {
            text,
            draft_email: data.draft_email ?? null,
            warnings: data.warnings ?? [],
            usage: data.usage ?? null
        };
    }
    return { text: extractDisplayText(String(data)), draft_email: null, warnings: [], usage: null };
}

export const useChat = (jwtToken) => {
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [tokensUsed, setTokensUsed] = useState(0);
    const [warnings, setWarnings] = useState([]);
    const [conversationId, setConversationId] = useState(null);
    const [lastDraft, setLastDraft] = useState(null);
    const [lastMeta, setLastMeta] = useState(null);
    const [isLocked, setIsLocked] = useState(false);
    const [resetAt, setResetAt] = useState(null);

    const sendMessage = useCallback(async (content, mode = 'chat') => {
        const userMsg = {
            id: crypto.randomUUID(),
            role: 'user',
            content,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);
        setWarnings([]);
        setLastDraft(null);
        setIsLocked(false);

        const token = jwtToken || localStorage.getItem('authToken') || localStorage.getItem('jwtToken');
        if (!token) {
            setMessages(prev => [...prev, {
                id: crypto.randomUUID(),
                role: 'system',
                content: 'Error: Please log in to continue.',
                timestamp: new Date()
            }]);
            setIsTyping(false);
            return;
        }

        try {
            const contextMessages = [...messages, userMsg].slice(-20).map(m => ({
                role: m.role,
                content: m.content
            }));

            const response = await fetch(`${API_BASE}/api/ai/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    messages: contextMessages,
                    conversation_id: conversationId,
                    mode
                })
            });

            const data = await response.json();

            if (response.status === 429) {
                setIsLocked(true);
                setResetAt(data.reset_at || null);
                setWarnings(data.warnings || []);
                setMessages(prev => [...prev, {
                    id: crypto.randomUUID(),
                    role: 'system',
                    content: data.error || "You've reached your daily limit. Come back tomorrow.",
                    timestamp: new Date()
                }]);
                setIsTyping(false);
                return;
            }

            if (response.status === 402) {
                setWarnings(data.warnings || []);
                setMessages(prev => [...prev, {
                    id: crypto.randomUUID(),
                    role: 'system',
                    content: data.error || 'Insufficient tokens.',
                    timestamp: new Date()
                }]);
                setIsTyping(false);
                return;
            }

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get response');
            }

            const normalized = normalizeChatResponse(data);
            const meta = data.meta || {};

            if (meta.conversation_id) {
                setConversationId(meta.conversation_id);
            }
            setLastMeta({
                professor_name: meta.professor_name,
                recipient_email: meta.recipient_email,
                conversation_id: meta.conversation_id
            });
            if (normalized.draft_email?.body) {
                setLastDraft(normalized.draft_email);
            }

            setWarnings(normalized.warnings);

            const usage = normalized.usage ?? data.usage;
            if (usage?.total_tokens) {
                setTokensUsed(prev => prev + usage.total_tokens);
            }

            const aiMsg = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: normalized.text,
                draftEmail: normalized.draft_email ?? null,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);

        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                id: crypto.randomUUID(),
                role: 'system',
                content: `Error: ${error.message || 'Could not reach LetterLab. Please try again.'}`,
                timestamp: new Date()
            }]);
        } finally {
            setIsTyping(false);
        }
    }, [messages, conversationId]);

    const clearLastDraft = useCallback(() => {
        setLastDraft(null);
    }, []);

    return {
        messages,
        sendMessage,
        isTyping,
        tokensUsed,
        warnings,
        conversationId,
        lastDraft,
        lastMeta,
        isLocked,
        resetAt,
        clearLastDraft
    };
};
