const LOGIN_AT_KEY = "letterlab_login_at";
const LAST_ACTIVITY_KEY = "letterlab_last_activity";

export function setLoginTimestamp() {
  try {
    localStorage.setItem(LOGIN_AT_KEY, String(Date.now()));
  } catch (_) { }
}

export function setLastActivityTimestamp() {
  try {
    localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
  } catch (_) { }
}

export function getLoginTimestamp() {
  try {
    const v = localStorage.getItem(LOGIN_AT_KEY);
    return v ? parseInt(v, 10) : null;
  } catch {
    return null;
  }
}

export function getLastActivityTimestamp() {
  try {
    const v = localStorage.getItem(LAST_ACTIVITY_KEY);
    return v ? parseInt(v, 10) : null;
  } catch {
    return null;
  }
}

export function formatDuration(ms) {
  if (ms == null || ms < 0) return "0m 0s";
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}m ${String(s).padStart(2, "0")}s`;
}

export function clearSession() {
  try {
    const keys = [
      "authToken",
      "letterlab_user",
      "letterlab_auth_provider",
      "letterlab_outlook_token",
      "letterlab_google_token",
      LOGIN_AT_KEY,
      LAST_ACTIVITY_KEY
    ];
    keys.forEach(k => localStorage.removeItem(k));
    // Optional: notify app of auth change
    window.dispatchEvent(new Event('llp_auth_changed'));
  } catch (_) { }
}
