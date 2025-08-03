import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Check if the request is for an admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Only allow access in development environment
    if (process.env.NODE_ENV !== 'development') {
      return new NextResponse('Access denied. Admin routes are only available in development environment.', {
        status: 403,
      });
    }
  }

  return NextResponse.next();
}

// Configure the paths that should trigger this middleware
export const config = {
  matcher: [
    // Match all admin routes
    '/admin/:path*',
    // Match all admin API routes
    '/api/admin/:path*',
  ],
};
