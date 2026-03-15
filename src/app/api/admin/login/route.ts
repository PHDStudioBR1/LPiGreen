import { NextRequest, NextResponse } from 'next/server';
import {
  validateAdminCredentials,
  createAdminToken,
  getAdminCookieName,
  getAdminCookieOptions,
} from '@/lib/auth-admin';
import { checkLoginRateLimit, clearLoginAttempts } from '@/lib/rate-limit-login';

export async function POST(request: NextRequest) {
  const limit = checkLoginRateLimit(request);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: 'Muitas tentativas de login. Tente novamente mais tarde.',
        retryAfter: limit.retryAfter,
      },
      {
        status: 429,
        headers: limit.retryAfter
          ? { 'Retry-After': String(limit.retryAfter) }
          : undefined,
      }
    );
  }

  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Corpo da requisição inválido' },
      { status: 400 }
    );
  }

  const username = typeof body.username === 'string' ? body.username.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!username || !password) {
    return NextResponse.json(
      { error: 'Usuário e senha são obrigatórios' },
      { status: 400 }
    );
  }

  const valid = await validateAdminCredentials(username, password);
  if (!valid) {
    return NextResponse.json(
      { error: 'Usuário ou senha inválidos' },
      { status: 401 }
    );
  }

  clearLoginAttempts(request);
  const token = await createAdminToken(username);
  const cookieName = getAdminCookieName();
  const options = getAdminCookieOptions();

  const res = NextResponse.json({ success: true, username });
  res.cookies.set(cookieName, token, options);
  return res;
}
