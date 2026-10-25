import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/server/auth/session";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/habits",
  "/calendar",
  "/analytics",
  "/goals",
  "/settings",
];

const AUTH_PAGES = ["/login", "/signup"];

/**
 * Next.js 16 Proxy Convention (replaces middleware.ts)
 * Performs edge-level session validation and route redirection.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  const session = sessionCookie ? await verifySessionToken(sessionCookie) : null;
  const isAuthenticated = !!session?.userId;

  // Protected application routes -> redirect to /login if unauthenticated
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Guest-only auth routes -> redirect to /dashboard if already authenticated
  const isAuthPage = AUTH_PAGES.some(
    (page) => pathname === page || pathname.startsWith(`${page}/`)
  );

  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/habits/:path*",
    "/calendar/:path*",
    "/analytics/:path*",
    "/goals/:path*",
    "/settings/:path*",
    "/login",
    "/signup",
  ],
};
