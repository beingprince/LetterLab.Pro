import { useState, useEffect } from 'react';

/**
 * useFetchThreads
 * 
 * Custom hook to fetch email threads for a specific professor from Gmail or Outlook API.
 * Automatically fetches when professor email is provided.
 * Supports both 'gmail' and 'outlook' providers.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useFetchThreads = (professorEmail, provider = 'gmail', retryTrigger = 0) => {
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAuthError, setIsAuthError] = useState(false);

    useEffect(() => {
        if (!professorEmail) {
            setThreads([]);
            setError(null);
            setIsAuthError(false);
            return;
        }

        const fetchThreads = async () => {
            setLoading(true);
            setError(null);
            setIsAuthError(false);

            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    setIsAuthError(true);
                    setError('Session expired. Please sign in again.');
                    setThreads([]);
                    return;
                }

                const apiPath = provider === 'outlook'
                    ? '/api/outlook/threads/by-professor'
                    : '/api/gmail/threads/by-professor';

                const response = await fetch(
                    `${API_BASE}${apiPath}?email=${encodeURIComponent(professorEmail)}`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.status === 401) {
                    setIsAuthError(true);
                    setError('Session expired. Please sign in again.');
                    setThreads([]);
                    try {
                        window.dispatchEvent(new Event("llp_session_expired"));
                    } catch (_) {}
                    return;
                }

                if (!response.ok) {
                    let errMsg = 'Failed to fetch threads';
                    try {
                        const body = await response.json();
                        errMsg = body?.error || errMsg;
                    } catch (_) {}
                    setError(errMsg);
                    setThreads([]);
                    return;
                }

                let data;
                try {
                    data = await response.json();
                } catch {
                    setError('Invalid response from server');
                    setThreads([]);
                    return;
                }
                setThreads(data.threads || []);
            } catch (err) {
                setError(err?.message || 'Failed to fetch threads');
                setThreads([]);
            } finally {
                setLoading(false);
            }
        };

        fetchThreads();
    }, [professorEmail, provider, retryTrigger]);

    return { threads, loading, error, isAuthError };
};
