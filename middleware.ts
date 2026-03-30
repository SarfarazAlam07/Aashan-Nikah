// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';

const publicRoutes = [
  '/',
  '/signin',
  '/signup',
  '/api/auth/login',
  '/api/auth/register',
  '/_next',
  '/favicon.ico'
];

const protectedRoutes = ['/user', '/admin', '/mufti', '/api/user', '/api/admin', '/api/mufti', '/api/requests', '/api/profiles'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow public routes
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  if (!isProtected) return NextResponse.next();
  
  // Get token
  let token = request.cookies.get('token')?.value;
  if (!token) {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }
  
  // 🔥 FIX: Check if it's an API route or Page route 🔥
  const isApiRoute = pathname.startsWith('/api/');

  if (!token) {
    if (isApiRoute) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/signin', request.url));
  }
  
  const payload = verifyToken(token);
  
  if (!payload) {
    if (isApiRoute) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
    const response = NextResponse.redirect(new URL('/signin', request.url));
    response.cookies.delete('token');
    return response;
  }
  
  const role = payload.role;

  // STRICT ROLE ISOLATION
  if (pathname.startsWith('/admin') && role !== 'SUPER_ADMIN') {
    return NextResponse.redirect(new URL('/signin', request.url));
  }
  if (pathname.startsWith('/api/admin') && role !== 'SUPER_ADMIN') {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }
  
  if (pathname.startsWith('/mufti') && role !== 'MUFTI') {
    return NextResponse.redirect(new URL('/signin', request.url));
  }
  if (pathname.startsWith('/api/mufti') && role !== 'MUFTI') {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }
  
  if (pathname.startsWith('/user') && role !== 'USER') {
    return NextResponse.redirect(new URL('/signin', request.url));
  }
  
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', payload.id);
  requestHeaders.set('x-user-role', payload.role);
  requestHeaders.set('x-user-email', payload.email);
  
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|images|favicon.ico).*)']
};