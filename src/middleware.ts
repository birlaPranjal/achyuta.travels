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
  
  // Get the session token
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  // Redirect logic
  if (!isPublicPath && !token) {
    // If user is not authenticated and tries to access protected routes, redirect to login
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }
  
  // Only redirect authenticated users away from auth pages
  if (token && (path === '/auth/signin' || path === '/auth/signup')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Apply to all routes except static files, api routes, and _next
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 