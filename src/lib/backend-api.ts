const BACKEND_URL = process.env.LEAD_API_URL || 'http://api-service';
const API_KEY = process.env.LEAD_API_KEY || process.env.API_KEY || '';

export function getBackendUrl(path: string): string {
  return `${BACKEND_URL.replace(/\/$/, '')}${path}`;
}

export function backendFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const url = getBackendUrl(path);
  const headers: HeadersInit = { ...init.headers } as HeadersInit;
  if (API_KEY) {
    (headers as Record<string, string>)['X-API-Key'] = API_KEY;
  }
  return fetch(url, { ...init, headers });
}
