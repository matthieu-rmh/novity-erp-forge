import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

/*
  Why JWT strategy instead of PrismaAdapter + database sessions?

  With Credentials provider, NextAuth v4 can't create database sessions
  automatically — there's no OAuth account to associate them with.
  JWT strategy stores the session in an HTTP-only cookie (signed + encrypted
  with NEXTAUTH_SECRET), which is stateless and works well for this use case.

  The role comes from the DB on login, gets encoded in the JWT, and is
  available on every request without an extra DB query.
*/
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) return null;

        const passwordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!passwordValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? null,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    /*
      jwt callback fires on every token creation or refresh.
      On first sign-in, `user` is populated — we copy id + role into the token.
      On subsequent requests, `user` is undefined — the token carries the values.
    */
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    /*
      session callback fires when getServerSession() or useSession() is called.
      We copy id + role from the JWT into the session.user object so
      all Server Components receive fully typed session data.
    */
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
};
