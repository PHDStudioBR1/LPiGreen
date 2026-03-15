/**
 * Rate limit in-memory para tentativas de login admin.
 * 5 tentativas por 15 minutos por IP.
 */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const store = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim().slice(0, 64);
  }
  return 'unknown';
}

export function checkLoginRateLimit(request: Request): { allowed: boolean; retryAfter?: number } {
  const ip = getClientIp(request);
  const now = Date.now();
  let entry = store.get(ip);

  if (!entry) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (now >= entry.resetAt) {
    entry = { count: 1, resetAt: now + WINDOW_MS };
    store.set(ip, entry);
    return { allowed: true };
  }

  entry.count += 1;
  if (entry.count > MAX_ATTEMPTS) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { allowed: true };
}

export function clearLoginAttempts(request: Request): void {
  const ip = getClientIp(request);
  store.delete(ip);
}
