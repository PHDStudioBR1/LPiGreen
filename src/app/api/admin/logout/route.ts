import { NextResponse } from 'next/server';
import { getAdminCookieName } from '@/lib/auth-admin';

export async function POST() {
  const cookieName = getAdminCookieName();
  const res = NextResponse.json({ success: true });
  res.cookies.set(cookieName, '', {
    path: '/',
    maxAge: 0,
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });
  return res;
}
