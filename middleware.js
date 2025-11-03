import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './src/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request) {
  const { pathname } = request.nextUrl;

  // Normalize duplicate locale prefixes like /en/en/... -> /en/...
  const duplicateLocalePattern = /^\/(en|fr)\/\1(\/|$)/;
  if (duplicateLocalePattern.test(pathname)) {
    const normalizedPathname = pathname.replace(/^\/(en|fr)\/\1(?=\/|$)/, '/$1');
    const url = new URL(request.url);
    url.pathname = normalizedPathname;
    return NextResponse.redirect(url, 308);
  }

  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next`, `/_vercel`, `/dashboard`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|dashboard|.*\\..*).*)'
  ]
};

