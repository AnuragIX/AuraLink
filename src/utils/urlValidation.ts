/**
 * Strict validation helpers for dynamically configured URLs and contact metadata.
 * Prevents javascript:, data:, vbscript:, or credential-bearing links from rendering.
 */

export function isSafeHttpUrl(rawUrl: string): boolean {
  const trimmed = rawUrl.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return false;
    }
    if (parsed.username || parsed.password) {
      return false;
    }
    return Boolean(parsed.hostname);
  } catch {
    return false;
  }
}

export function isValidContactEmail(rawEmail: string): boolean {
  const trimmed = rawEmail.trim();
  if (!trimmed || trimmed.length > 254) return false;
  // Reject newlines, whitespace, or mailto injection characters (?, &, <, >)
  if (/[\s\r\n?&<>'"]/.test(trimmed)) return false;
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/.test(trimmed);
}
