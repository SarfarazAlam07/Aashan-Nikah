// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';

// Public routes (no authentication required)
const publicRoutes = [
  '/',
  '/signin',
  '/signup',
  '/api/auth/login',
  '/api/auth/register',
  '/api/test-db',
  '/api/test-env',
  '/_next',
  '/favicon.ico'
];

// Protected routes that require authentication
const protectedRoutes = [
  '/user/',
  '/admin/',
  '/api/user/',
  '/api/admin/',
  '/api/requests/',
  '/api/profiles/'
];

// Admin-only routes
const adminRoutes = [
  '/admin/',
  '/api/admin/'
];

// Super Admin only routes
const superAdminRoutes = [
  '/api/admin/muftis/',
  '/api/admin/settings/'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow public routes
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // Check if route is protected
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (!isProtected) {
    return NextResponse.next();
  }
  
  // Get token from cookies
  let token = request.cookies.get('token')?.value;
  
  // Also check Authorization header
  if (!token) {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }
  
  // No token - redirect to login
  if (!token) {
    const loginUrl = new URL('/signin', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Verify token
  const payload = verifyToken(token);
  
  if (!payload) {
    // Invalid token - clear and redirect
    const response = NextResponse.redirect(new URL('/signin', request.url));
    response.cookies.delete('token');
    return response;
  }
  
  // Check admin routes
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  if (isAdminRoute && payload.role !== 'SUPER_ADMIN' && payload.role !== 'MUFTI') {
    return NextResponse.redirect(new URL('/user/dashboard', request.url));
  }
  
  // Check super admin routes
  const isSuperAdminRoute = superAdminRoutes.some(route => pathname.startsWith(route));
  if (isSuperAdminRoute && payload.role !== 'SUPER_ADMIN') {
    return NextResponse.json(
      { success: false, error: 'Forbidden' },
      { status: 403 }
    );
  }
  
  // Add user info to headers for API routes
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', payload.id);
  requestHeaders.set('x-user-role', payload.role);
  requestHeaders.set('x-user-email', payload.email);
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|images|favicon.ico).*)',
  ]
};