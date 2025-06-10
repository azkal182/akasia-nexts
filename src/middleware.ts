// Protecting routes with next-auth
// https://next-auth.js.org/configuration/nextjs#middleware
// https://nextjs.org/docs/app/building-your-application/routing/middleware

// import NextAuth from 'next-auth';
// import authConfig from '@/lib/auth.config';

// const { auth } = NextAuth(authConfig);

// export default auth((req) => {
//     if (!req.auth) {
//         const url = req.url.replace(req.nextUrl.pathname, '/');
//         return Response.redirect(url);
//     }
// });

// export const config = { matcher: ['/dashboard/:path*'] };
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes
} from '../routes';
import NextAuth from 'next-auth';
import authConfig from './lib/auth.config';

// Use only one of the two middleware options below
// 1. Use middleware directly
// export const { auth: middleware } = NextAuth(authConfig)

// 2. Wrapped middleware option
const { auth } = NextAuth(authConfig);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//    @ts-expect-error
export default auth(async function middleware(req) {
  const { nextUrl } = req;

  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // console.log(nextUrl.pathname)
  if (isApiAuthRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    console.log(
      'User is not logged in, redirecting to login page',
      nextUrl.pathname
    );
    return Response.redirect(new URL('/login', nextUrl));
  }
});

export const config = {
  // matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
};
