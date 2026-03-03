// frontend/src/hooks/useAnalytics.js
import { useState, useEffect, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useAnalytics = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboard = useCallback(async () => {
        try {
            const token = localStorage.getItem('authToken');

            if (!token) {
                // Determine if we should redirect or just wait
                // For now, just stop
                return;
            }

            const response = await fetch(`${API_BASE}/api/analytics/dashboard`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch dashboard data');
            }

            const data = await response.json();
            setDashboardData(data);
            setError(null);
        } catch (err) {
            console.error('[useAnalytics] Error fetching dashboard:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboard();

        // Auto-refresh every 60 seconds
        const interval = setInterval(() => {
            fetchDashboard();
        }, 60000);

        return () => clearInterval(interval);
    }, [fetchDashboard]);

    return {
        data: dashboardData,
        loading,
        error,
        refetch: fetchDashboard
    };
};
