import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';

// Proxy approach: Next.js rewrites (next.config.ts) handle i18n locale routing.
// This middleware only protects /admin routes with GitHub OAuth.
export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === '/admin/login') return NextResponse.next();

  if (pathname.startsWith('/admin')) {
    const session = await auth();
    if (!session) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
