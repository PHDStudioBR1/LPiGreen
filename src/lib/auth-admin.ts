import { SignJWT, jwtVerify } from 'jose';
import { compare } from 'bcryptjs';

const COOKIE_NAME = 'admin_session';
const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET || 'change-me-in-production'
);
const JWT_EXPIRES_IN = '8h';

export type AdminPayload = { sub: string };

export function getAdminCookieName() {
  return COOKIE_NAME;
}

export async function createAdminToken(username: string): Promise<string> {
  return new SignJWT({ sub: username })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(JWT_EXPIRES_IN)
    .setIssuedAt()
    .sign(JWT_SECRET);
}

export async function verifyAdminToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const sub = payload.sub;
    if (typeof sub !== 'string' || !sub) return null;
    return { sub };
  } catch {
    return null;
  }
}

export async function validateAdminCredentials(
  username: string,
  password: string
): Promise<boolean> {
  const envUser = process.env.ADMIN_USER;
  const envPassword = process.env.ADMIN_PASSWORD;
  const envPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!envUser || username !== envUser.trim()) return false;

  if (envPasswordHash) {
    return compare(password, envPasswordHash);
  }
  if (envPassword) {
    return password === envPassword;
  }
  return false;
}

export function getAdminCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict' as const,
    path: '/',
    maxAge: 8 * 60 * 60, // 8h em segundos
  };
}
