import React, { useState, useMemo } from 'react';
import { Button, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { sendEmailDraft, getToEmail } from '../../adapters/emailDraftArtifact';

/**
 * EmailFinalReview - Shared preview/edit/send component for both
 * Pull Email and Chat flows. Single source of truth for the final
 * review UI. Calls /api/{provider}/send/new or /send/reply.
 *
 * @param {Object} props
 * @param {import('../../adapters/emailDraftArtifact').EmailDraftArtifact} props.artifact - Normalized draft
 * @param {() => void} props.onSuccess - Called after successful send (or when user dismisses success)
 * @param {() => void} props.onCancel - Called when user cancels/backs
 * @param {string} [props.successButtonText] - Optional label for success screen button (e.g. "Return to Dashboard")
 */
const EmailFinalReview = ({ artifact: initialArtifact, onSuccess, onCancel, successButtonText = 'Continue' }) => {
    const [to, setTo] = useState(() => getToEmail(initialArtifact) || '');
    const [subject, setSubject] = useState(initialArtifact?.subject || '');
    const [body, setBody] = useState(initialArtifact?.body || '');
    const [status, setStatus] = useState('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const artifact = useMemo(
        () => ({
            ...initialArtifact,
            to: to ? [{ email: to }] : [],
            subject,
            body
        }),
        [initialArtifact, to, subject, body]
    );

    const handleSend = async () => {
        if (!to || !body) {
            setErrorMsg('To and body are required.');
            return;
        }
        if (artifact.mode === 'new' && !subject) {
            setErrorMsg('Subject is required.');
            return;
        }

        setStatus('sending');
        setErrorMsg('');

        try {
            const token = localStorage.getItem('authToken');
            if (!token) throw new Error('Please log in to send.');

            await sendEmailDraft(artifact, token);
            setStatus('success');
        } catch (err) {
            setErrorMsg(err?.message || 'Failed to send email.');
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
                <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Email sent!</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">You can continue in LetterLab.</p>
                <Button
                    variant="outlined"
                    onClick={onSuccess}
                    sx={{ borderRadius: 3, textTransform: 'none', px: 4 }}
                >
                    {successButtonText}
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto w-full p-6 h-full flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Final Review</h2>

            {errorMsg && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
                    {errorMsg}
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex-1 flex flex-col shadow-sm">
                <div className="flex items-center border-b border-gray-100 dark:border-gray-700 py-2">
                    <span className="text-gray-500 w-16">To:</span>
                    <input
                        type="email"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="flex-1 bg-transparent border-none font-medium text-gray-900 dark:text-white p-0 focus:ring-0"
                        placeholder="recipient@example.com"
                    />
                </div>
                <div className="flex items-center border-b border-gray-100 dark:border-gray-700 py-2 mb-4">
                    <span className="text-gray-500 w-16">Subject:</span>
                    {artifact.mode === 'reply' ? (
                        <span className="text-gray-400 italic flex-1">{subject || 'Re: (thread)'}</span>
                    ) : (
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="flex-1 bg-transparent border-none focus:ring-0 font-medium text-gray-900 dark:text-white p-0"
                            placeholder="Subject"
                        />
                    )}
                </div>
                <textarea
                    className="flex-1 w-full min-h-[200px] resize-none bg-transparent border-none focus:ring-0 p-0 text-base leading-relaxed text-gray-800 dark:text-gray-200 font-sans"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Email body"
                />
            </div>

            <div className="mt-6 flex justify-end gap-3">
                <Button
                    variant="outlined"
                    onClick={onCancel}
                    disabled={status === 'sending'}
                    sx={{ borderRadius: 3, textTransform: 'none' }}
                >
                    {artifact.mode === 'reply' ? 'Back' : 'Cancel'}
                </Button>
                <Button
                    variant="contained"
                    size="large"
                    onClick={handleSend}
                    disabled={status === 'sending'}
                    sx={{
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 700,
                        px: 6,
                        py: 1.5,
                        bgcolor: '#2563EB',
                        '&:hover': { bgcolor: '#1D4ED8' }
                    }}
                >
                    {status === 'sending' ? (
                        <>
                            <CircularProgress size={20} sx={{ color: 'white', mr: 1 }} />
                            Sending...
                        </>
                    ) : (
                        'Send Now'
                    )}
                </Button>
            </div>
        </div>
    );
};

export default EmailFinalReview;
