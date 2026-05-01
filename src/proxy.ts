import createIntlMiddleware from 'next-intl/middleware';
import { routing } from '@/libs/i18n/routing';
import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createIntlMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Admin routes → check GitHub auth, no i18n needed
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') return NextResponse.next();
    const session = await auth();
    if (!session) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 2. Everything else → next-intl handles locale routing
  return intlMiddleware(req);
}

export const config = {
  // Run on all pages except static files, _next internals, and API routes
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
