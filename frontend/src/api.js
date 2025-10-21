// frontend/src/api.js
// Normalize API base to avoid double "/api" and trailing slash issues

const rawBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
const BASE = rawBase.replace(/\/+$/, ""); // strip trailing slashes

export async function apiRequest(path, method = "GET", body = null, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  // ensure there’s only one "/" between BASE and path
  const urlPath = path.startsWith("/") ? path : `/${path}`;

  const res = await fetch(`${BASE}${urlPath}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { error: text };
  }

  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}
