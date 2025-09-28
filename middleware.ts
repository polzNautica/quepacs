import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Only handle auth pages in middleware, let ProtectedRoute handle the rest
  if (pathname === '/login' || pathname === '/register') {
    if (token) {
      // If user has token and tries to access login/register, redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // For all other routes, let the client-side ProtectedRoute handle the logic
  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register'],
};