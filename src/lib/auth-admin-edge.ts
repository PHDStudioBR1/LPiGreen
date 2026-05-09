/**
 * Auth helpers usados apenas no middleware (Edge Runtime).
 * Não importar bcrypt nem o pacote 'jose' completo aqui.
 */
import { jwtVerify } from 'jose/jwt/verify';

export const ADMIN_COOKIE_NAME = 'admin_session';

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET || 'change-me-in-production'
);

export type AdminPayload = { sub: string };

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
