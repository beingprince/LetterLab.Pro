// Fetch footer page content and status (no auth required)

const rawBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const BASE = rawBase.replace(/\/+$/, '');

export async function fetchFooterPage(slug) {
  const q = encodeURIComponent(slug);
  const res = await fetch(`${BASE}/api/footer-pages?slug=${q}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function fetchStatus() {
  const res = await fetch(`${BASE}/api/status`);
  if (!res.ok) throw new Error('Status unavailable');
  return res.json();
}

export async function submitContact(data) {
  const res = await fetch(`${BASE}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
  return json;
}

export async function submitTalentWaitlist(data) {
  const res = await fetch(`${BASE}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, topic: 'Talent waitlist' }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
  return json;
}
