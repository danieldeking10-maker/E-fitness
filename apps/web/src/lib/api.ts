/**
 * Returns the API base URL for backend requests.
 * In development the API runs on port 4000; in production it's the same host.
 */
export function getApiBaseUrl(): string {
  return '/api';
}
