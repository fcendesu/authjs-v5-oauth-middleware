import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const privateRoutes = ["/dashboard", "/deneme"];

const { auth } = NextAuth(authConfig);
export default auth(async (req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;
  const isLoginRoute = nextUrl.pathname.startsWith("/login");

  if (isLoggedIn && isLoginRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  if (
    !isLoggedIn &&
    privateRoutes.some((route) => nextUrl.pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
});

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/dashboard/:path*",
    "/login",
  ],
};
