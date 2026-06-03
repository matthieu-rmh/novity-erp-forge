/*
  NextAuth v4 catch-all route.
  All auth endpoints (/api/auth/signin, /api/auth/session, /api/auth/signout,
  /api/auth/callback/credentials, etc.) are handled by a single handler.

  The [...nextauth] folder name tells Next.js this is a catch-all route —
  any path under /api/auth/* is forwarded here.
*/

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
