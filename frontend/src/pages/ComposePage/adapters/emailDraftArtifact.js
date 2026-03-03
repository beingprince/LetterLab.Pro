/**
 * EmailDraftArtifact - Unified data contract for email preview/send across
 * Pull Email and Chat flows. Single source of truth for draft shape.
 *
 * @typedef {Object} EmailDraftArtifact
 * @property {"gmail"|"outlook"} provider
 * @property {"new"|"reply"} mode
 * @property {{ name?: string, email: string }[]} to
 * @property {{ name?: string, email: string }[]} [cc]
 * @property {string} subject
 * @property {string} body
 * @property {string} [threadId]  - for reply mode
 * @property {string} [messageId]
 * @property {string} [conversationId] - for chat storage / analytics
 * @property {{ professorName?: string }} [meta]
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/** Helper: extract primary To email from artifact */
export function getToEmail(artifact) {
    if (!artifact?.to?.length) return '';
    const first = artifact.to[0];
    return typeof first === 'string' ? first : (first?.email || '');
}

/**
 * Build EmailDraftArtifact from chat flow data (after subject selection).
 * @param {{ draftBody: string, selectedSubject: string, chatContext: { professorName?: string, recipientEmail: string, conversationId?: string }, provider: "gmail"|"outlook" }} params
 * @returns {EmailDraftArtifact}
 */
export function chatDraftToArtifact({ draftBody, selectedSubject, chatContext, provider }) {
    if (!provider) throw new Error('Missing provider for draft.');
    const recipientEmail = chatContext?.recipientEmail || '';
    return {
        provider: provider,
        mode: 'new',
        to: [{ email: recipientEmail, name: chatContext?.professorName }].filter((r) => r.email),
        subject: selectedSubject || '',
        body: draftBody || '',
        conversationId: chatContext?.conversationId || undefined,
        meta: chatContext?.professorName ? { professorName: chatContext.professorName } : undefined
    };
}

/**
 * Build EmailDraftArtifact from Pull Email stateData.
 * @param {{ stateData: object, provider: string }} params
 * @returns {EmailDraftArtifact}
 */
export function pullStateToArtifact({ stateData, provider }) {
    if (!provider) throw new Error('Missing provider for pull flow.');
    const prof = stateData?.selectedProfessor;
    const email = prof?.email || '';
    const sendMode = stateData?.sendMode || 'new';

    return {
        provider: provider,
        mode: sendMode,
        to: email ? [{ email, name: prof?.name }] : [],
        subject:
            sendMode === 'reply'
                ? `Re: ${stateData?.selectedThread?.subject || ''}`
                : stateData?.selectedSubject || '',
        body: stateData?.finalBody || '',
        threadId: sendMode === 'reply' ? stateData?.selectedThread?.id : undefined,
        meta: prof?.name ? { professorName: prof.name } : undefined
    };
}

/**
 * Send an EmailDraftArtifact via the correct provider endpoint.
 * Uses /api/{provider}/send/new or /api/{provider}/send/reply.
 *
 * @param {EmailDraftArtifact} artifact
 * @param {string} authToken
 * @returns {Promise<{ id?: string, threadId?: string }>}
 */
export async function sendEmailDraft(artifact, authToken) {
    const to = getToEmail(artifact);
    if (!to || !artifact.body) {
        throw new Error('To and body are required.');
    }
    if (artifact.mode === 'new' && !artifact.subject) {
        throw new Error('Subject is required for new emails.');
    }

    const endpoint =
        artifact.mode === 'reply'
            ? `/api/${artifact.provider}/send/reply`
            : `/api/${artifact.provider}/send/new`;

    const payload =
        artifact.mode === 'reply'
            ? {
                threadId: artifact.threadId,
                body: artifact.body,
                to,
                subject: artifact.subject
            }
            : {
                to,
                subject: artifact.subject,
                body: artifact.body,
                conversationId: artifact.conversationId || undefined
            };

    const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(payload)
    });

    if (res.status === 401) {
        const data = await res.json().catch(() => ({}));
        const errorText = data?.error || '';

        // Only trigger session expiry if it's NOT a provider connection issue
        const isProviderError =
            errorText.toLowerCase().includes('not connected') ||
            errorText.toLowerCase().includes('reconnect');

        if (!isProviderError) {
            try {
                window.dispatchEvent(new Event('llp_session_expired'));
            } catch (_) { }
            throw new Error('Session expired. Please sign in again.');
        } else {
            throw new Error(errorText || 'Provider not connected.');
        }
    }

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || data?.details || `Failed to send (${res.status})`);
    }

    return res.json();
}
