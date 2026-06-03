"use client";

/*
  SessionProvider makes the NextAuth session available to all Client Components
  via useSession(). It must be a Client Component itself (uses React context).

  We isolate it here so the root layout (app/layout.tsx) can stay a Server
  Component — if we imported SessionProvider directly there, the whole layout
  would become a Client Component, which defeats the purpose of App Router.
*/

import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
