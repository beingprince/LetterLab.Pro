import { useState } from 'react';

/**
 * useGeneration - Hook for AI email generation
 * Connects to backend API
 */
export const useGeneration = (jwtToken) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const generateEmail = async (prompt) => {
        setIsLoading(true);
        setError(null);

        try {
            const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';

            const response = await fetch(`${apiBase}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) {
                throw new Error('Generation failed');
            }

            const data = await response.json();
            return {
                subject: data.subject || 'Generated Email',
                body: data.body || data.text || data.draft || ''
            };

        } catch (err) {
            setError(err.message);
            console.error('Generation error:', err);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { generateEmail, isLoading, error };
};
