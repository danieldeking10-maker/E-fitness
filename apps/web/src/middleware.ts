import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If a POST request is sent directly to /ai/... (e.g. from client API calls),
  // rewrite it to the internal /api/ai/... route handler
  if (request.method === 'POST' && pathname.startsWith('/ai/')) {
    const targetUrl = new URL(`/api${pathname}`, request.url);
    return NextResponse.rewrite(targetUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/ai/:path*'],
};
