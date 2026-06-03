"use client";

/*
  Minimal Client Component — the only reason this is a separate file is that
  signOut() from next-auth/react is client-side only. By isolating it here,
  the parent Header stays a Server Component.

  This pattern (Server Component + small "leaf" Client Components for
  interactivity) is the recommended App Router pattern. It keeps most of
  the page server-rendered and narrows the JS bundle.
*/

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export function LogoutButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      Déconnexion
    </Button>
  );
}
