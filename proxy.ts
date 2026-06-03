/*
  Next.js 16 replaced middleware.ts with proxy.ts.
  This file runs on the Edge before every matched request.

  We read the NextAuth JWT from the request cookie using getToken().
  If no valid token exists, we redirect to /login.
  This protects all /dashboard/* routes without touching the DB on every request.
*/

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
