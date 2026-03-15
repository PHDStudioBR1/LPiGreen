import { NextRequest, NextResponse } from 'next/server';
import { getAdminCookieName, verifyAdminToken } from '@/lib/auth-admin';

export async function GET(request: NextRequest) {
  const cookieName = getAdminCookieName();
  const token = request.cookies.get(cookieName)?.value;
  if (!token) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const payload = await verifyAdminToken(token);
  if (!payload) {
    const res = NextResponse.json({ error: 'Sessão inválida ou expirada' }, { status: 401 });
    res.cookies.set(cookieName, '', { path: '/', maxAge: 0 });
    return res;
  }

  return NextResponse.json({ username: payload.sub });
}
