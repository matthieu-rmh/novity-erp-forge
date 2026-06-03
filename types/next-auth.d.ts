/*
  NextAuth v4 types are extended via module augmentation.
  Without this file, session.user has only { name, email, image }.
  We add `id` and `role` so all Server Components and Server Actions
  can read them from the session without casting to `any`.
*/

import type { Role } from "@/app/generated/prisma/client";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    role: Role;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: Role;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}
