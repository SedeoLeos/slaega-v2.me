import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/libs/i18n/routing";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createIntlMiddleware(routing);

// ── Security headers added to every response ─────────────────────
const SECURITY_HEADERS: Record<string, string> = {
  // Prevent MIME-type sniffing
  "X-Content-Type-Options": "nosniff",
  // Disallow embedding in iframes (clickjacking)
  "X-Frame-Options": "DENY",
  // Tell browsers to enforce HTTPS for 2 years
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  // Limit referrer information to origin only
  "Referrer-Policy": "strict-origin-when-cross-origin",
  // Disable browser features not used by the site
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
};

function applySecurityHeaders(res: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(key, value);
  }
  return res;
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Admin routes → check GitHub auth, no i18n needed
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return applySecurityHeaders(NextResponse.next());
    }
    const session = await auth();
    if (!session) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return applySecurityHeaders(NextResponse.next());
  }

  // 2. Everything else → next-intl locale routing + security headers
  const res = intlMiddleware(req);
  return applySecurityHeaders(res as NextResponse);
}

export const config = {
  // Run on all pages except static files, _next internals, and API routes.
  // API routes handle their own rate-limiting at the handler level.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
