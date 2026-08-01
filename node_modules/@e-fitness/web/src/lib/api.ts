/**
 * Returns the API base URL for backend requests.
 * In development the API runs on port 4000; in production it's the same host.
 */
export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // Browser — use relative proxy or explicit localhost
    const host = window.location.hostname;
    // If we're on a dev server (localhost or 127.0.0.1), point to the Nest API port
    if (host === 'localhost' || host === '127.0.0.1') {
      return `http://${host}:4000`;
    }
    // Production — same origin, the API is served behind a reverse proxy
    return '';
  }
  // SSR — fallback
  return 'http://localhost:4000';
}
