import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const isPublicPath = 
    path === '/auth/signin' || 
    path === '/auth/signup' || 
    path === '/auth/forgot-password' ||
    path === '/' ||
    path.startsWith('/api/') ||  // Allow API routes
    path.includes('/_next/') ||  // Allow Next.js resources
    path.includes('/static/') ||
    path.includes('/images/') ||
    path === '/favicon.ico';
  
  // Define admin-only paths
  const isAdminPath = path.startsWith('/admin');
  
  // Get the session token
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  // Redirect logic
  if (!isPublicPath && !token) {
    // If user is not authenticated and tries to access protected routes, redirect to login
    const callbackUrl = encodeURIComponent(request.nextUrl.pathname);
    return NextResponse.redirect(new URL(`/auth/signin?callbackUrl=${callbackUrl}`, request.url));
  }
  
  // Check for admin access
  if (isAdminPath && token && token.role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Handle redirection after authentication
  if (token) {
    // If user just signed in (is on auth pages)
    if (path === '/auth/signin' || path === '/auth/signup') {
      // Get the callback URL from the query parameters
      const callbackUrl = request.nextUrl.searchParams.get('callbackUrl');
      
      if (callbackUrl) {
        // If there's a callback URL, redirect to it
        return NextResponse.redirect(new URL(callbackUrl, request.url));
      } else {
        // If no callback URL, redirect based on role
        if (token.role === 'admin') {
          return NextResponse.redirect(new URL('/admin', request.url));
        } else {
          return NextResponse.redirect(new URL('/', request.url));
        }
      }
    }
  }
  
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 