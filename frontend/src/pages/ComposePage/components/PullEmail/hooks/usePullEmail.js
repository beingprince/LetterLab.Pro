import { useState } from 'react';

/**
 * usePullEmail - Hook for pulling email threads
 */
export const usePullEmail = (jwtToken, outlookAccessToken) => {
    const [isSearching, setIsSearching] = useState(false);
    const [isFetchingThread, setIsFetchingThread] = useState(false);
    const [error, setError] = useState(null);

    const searchThreads = async (query, provider = 'gmail') => {
        setIsSearching(true);
        setError(null);

        try {
            const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';

            const response = await fetch(
                `${apiBase}/api/threads/search?q=${encodeURIComponent(query)}&provider=${provider}`,
                {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                        ...(provider === 'outlook' && outlookAccessToken ? {
                            'X-Outlook-Token': outlookAccessToken
                        } : {})
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Search failed');
            }

            const data = await response.json();
            return data.threads || [];

        } catch (err) {
            setError(err.message);
            console.error('Thread search error:', err);
            return [];
        } finally {
            setIsSearching(false);
        }
    };

    const fetchThread = async (threadId, provider = 'gmail') => {
        setIsFetchingThread(true);
        setError(null);

        try {
            const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';

            const response = await fetch(
                `${apiBase}/api/threads/${threadId}?provider=${provider}`,
                {
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                        ...(provider === 'outlook' && outlookAccessToken ? {
                            'X-Outlook-Token': outlookAccessToken
                        } : {})
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch thread');
            }

            const data = await response.json();
            return data.messages || [];

        } catch (err) {
            setError(err.message);
            console.error('Thread fetch error:', err);
            return [];
        } finally {
            setIsFetchingThread(false);
        }
    };

    const generateReply = async (threadId, context, provider = 'gmail') => {
        try {
            const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';

            const response = await fetch(
                `${apiBase}/api/threads/${threadId}/reply`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwtToken}`,
                        ...(provider === 'outlook' && outlookAccessToken ? {
                            'X-Outlook-Token': outlookAccessToken
                        } : {})
                    },
                    body: JSON.stringify({ context, provider })
                }
            );

            if (!response.ok) {
                throw new Error('Failed to generate reply');
            }

            const data = await response.json();
            return {
                subject: data.subject || 'Re: ' + context.subject,
                body: data.body || data.text || ''
            };

        } catch (err) {
            setError(err.message);
            console.error('Reply generation error:', err);
            return null;
        }
    };

    return {
        searchThreads,
        fetchThread,
        generateReply,
        isSearching,
        isFetchingThread,
        error
    };
};
