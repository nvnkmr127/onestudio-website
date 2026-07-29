import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getActiveRedirects, matchRedirect } from '@/lib/seo/redirects';
import { incrementRedirectHit } from '@/app/actions/redirects';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    const activeRedirects = await getActiveRedirects();
    const match = matchRedirect(pathname, activeRedirects);

    if (match) {
      // Async non-blocking hit count increment
      if (match.id) {
        incrementRedirectHit(match.id).catch(() => {});
      }

      let targetUrl: string;
      if (match.destination.startsWith('http://') || match.destination.startsWith('https://')) {
        targetUrl = match.destination;
      } else {
        const destPath = match.destination.startsWith('/') ? match.destination : `/${match.destination}`;
        targetUrl = new URL(destPath, request.url).toString();
      }

      return NextResponse.redirect(targetUrl, {
        status: match.status_code || 301,
      });
    }
  } catch {
    // Fall through gracefully if middleware fails
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public static files (images, svg, etc.)
     * - /admin routes
     * - /api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|admin|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};
