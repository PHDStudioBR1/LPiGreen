import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifyAdminToken } from '@/lib/auth-admin-edge';

const ADMIN_LOGIN_PATH = '/admin/login';
const API_ADMIN_LOGIN_PATH = '/api/admin/login';

function isAdminLoginPath(pathname: string): boolean {
  return pathname === ADMIN_LOGIN_PATH || pathname === API_ADMIN_LOGIN_PATH;
}

function isAdminPath(pathname: string): boolean {
  return pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
}

const UNPROTECTED_LEAD_SEGMENTS = ['progress', 'nao-verificado'];

/** Rotas de leads por ID (GET/PATCH/DELETE) ou /api/leads/:id/logs - exigir sessão admin */
function isProtectedLeadsIdPath(pathname: string): boolean {
  const match = pathname.match(/^\/api\/leads\/([^/]+)(\/.*)?$/);
  if (!match) return false;
  const segment = match[1];
  return !UNPROTECTED_LEAD_SEGMENTS.includes(segment);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isAdminLoginPath(pathname)) {
    const response = NextResponse.next();
    addSecurityHeaders(response);
    return response;
  }

  const requiresAdminAuth = isAdminPath(pathname) || isProtectedLeadsIdPath(pathname);

  if (requiresAdminAuth) {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

    if (!token) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
      }
      const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyAdminToken(token);
    if (!payload) {
      const response =
        pathname.startsWith('/api/')
          ? NextResponse.json({ error: 'Sessão inválida ou expirada' }, { status: 401 })
          : NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
      response.cookies.set(ADMIN_COOKIE_NAME, '', { path: '/', maxAge: 0 });
      return response;
    }
  }

  const response = NextResponse.next();
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    addSecurityHeaders(response);
  }
  return response;
}

function addSecurityHeaders(response: NextResponse) {
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/leads/:path*',
  ],
};
