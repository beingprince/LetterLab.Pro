import { useState, useEffect, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function useAccountMe() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMe = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const [accountRes, usageRes] = await Promise.all([
        fetch(`${API_BASE}/api/account/me`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/usage/me`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (accountRes.status === 401 || usageRes.status === 401) {
        try { window.dispatchEvent(new Event('llp_session_expired')); } catch (_) { }
        setError('Session expired');
        return;
      }

      if (!accountRes.ok || !usageRes.ok) {
        throw new Error('Failed to load account or usage data');
      }

      const accountJson = await accountRes.json();
      const usageJson = await usageRes.json();

      setData({
        ...accountJson,
        quota: {
          ...accountJson.quota,
          ...usageJson
        }
      });
    } catch (err) {
      setError(err?.message || 'Failed to load account');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return { data, loading, error, refetch: fetchMe };
}
