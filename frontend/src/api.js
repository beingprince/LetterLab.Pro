// frontend/src/api.js
// Normalize API base to avoid double "/api" and trailing slash issues

const rawBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
const BASE = rawBase.replace(/\/+$/, ""); // strip trailing slashes

const LS_KEY = 'letterlab_user';
const TOKEN_KEY = 'authToken'; // Standardized token key




export async function apiRequest(endpoint, method = 'GET', body = null) {
  // Try to get token from standardized storage
  let token = localStorage.getItem(TOKEN_KEY);

  // Fallback: try getting it from letterlab_user object (legacy support)
  if (!token) {
    try {
      const user = JSON.parse(localStorage.getItem(LS_KEY));
      token = user?.token;
    } catch (e) {
      console.error('Failed to parse user data:', e);
    }
  }

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Ensure endpoint starts with /
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  const response = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }

  return response.json();
}