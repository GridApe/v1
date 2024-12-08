import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Protected routes that require authentication
  const protectedPaths = ['/api/user', '/api/contacts'];

  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path));

  // Access token from cookies directly (server-side)
  const token = request.cookies.get('token')?.value; // Server-side cookie access

  // Log the token (useful for debugging)
  console.log('Token from cookies:', token);

  // If it's a protected path and there's no token, return 401
  if (isProtectedPath && !token) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unauthorized',
        message: 'No token provided, please login first.',
      },
      { status: 401 }
    );
  }

  // If token exists for protected path, add it to the request headers
  if (isProtectedPath && token) {
    const response = NextResponse.next();
    response.headers.set('Authorization', `Bearer ${token}`);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*', // Apply middleware only for paths that match the protected routes
};
