import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define which paths require authentication
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

// Define paths that should redirect if user is already logged in
const AUTH_REDIRECT_PATHS = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;

  // Check if path requires authentication
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  // If user is logged in and trying to access login/register pages, redirect to dashboard
  if (token && AUTH_REDIRECT_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If path requires authentication and user is not logged in, redirect to login page
  if (!isPublicPath && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// See: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    // Match all request paths except for:
    // - API routes
    // - Static files (images, etc.)
    // - _next
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
