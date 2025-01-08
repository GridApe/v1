import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const protectedPaths = ['/api/user', '/api/contacts'];
  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path));
  const isHomePage = request.nextUrl.pathname === '/';
  const token = request.cookies.get('token')?.value;

  if (isHomePage) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

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

  if (isProtectedPath && token) {
    const response = NextResponse.next();
    response.headers.set('Authorization', `Bearer ${token}`);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/api/:path*'],
};
