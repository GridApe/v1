import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const protectedPaths = ['/api/user', '/api/contacts'];
  const authPages = ['/auth/login', '/auth/register'];
  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path));
  const isAuthPage = authPages.includes(request.nextUrl.pathname);
  const isHomePage = request.nextUrl.pathname === '/';
  const token = request.cookies.get('token')?.value;

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect users from the home page
  if (isHomePage) {
    return token
      ? NextResponse.redirect(new URL('/dashboard', request.url))
      : NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Protect API routes
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

  // Attach token for protected API routes
  if (isProtectedPath && token) {
    const response = NextResponse.next();
    response.headers.set('Authorization', `Bearer ${token}`);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/auth/:path*', '/api/:path*'],
};
