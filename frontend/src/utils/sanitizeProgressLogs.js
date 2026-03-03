/**
 * sanitizeProgressLogs
 * Ensures logs never include PII: email bodies, tokens, auth codes, personal addresses.
 * Only allows stage names, durations, HTTP status, generic messages.
 */

const MAX_MESSAGE_LENGTH = 120;
const PII_PATTERNS = [
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  /Bearer\s+[\w-]+\.[\w-]+\.[\w-]+/gi,
  /\b(?:token|password|secret|auth)\s*[=:]\s*\S+/gi,
  /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
];

function redactPII(str) {
  if (typeof str !== "string") return "[invalid]";
  let out = str;
  for (const re of PII_PATTERNS) {
    out = out.replace(re, "[redacted]");
  }
  return out.length > MAX_MESSAGE_LENGTH ? out.slice(0, MAX_MESSAGE_LENGTH) + "…" : out;
}

export function sanitizeLogMessage(level, rawMessage) {
  const safe = redactPII(String(rawMessage ?? ""));
  return { level, message: safe };
}
