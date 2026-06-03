"use client";

/*
  Client Component — needs useState (error messages) and useRouter (redirect).
  Uses signIn() from next-auth/react, which posts to /api/auth/callback/credentials
  and returns { error } or { ok: true } without a full page reload.

  Why not a Server Action here? NextAuth v4's session creation is HTTP-cookie-based
  and managed internally — there's no server-side signIn() equivalent in v4.
  CLAUDE.md's "Server Actions for mutations" applies to our own data (contacts, orders…),
  not to the auth framework's internal flow.
*/

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // handle redirect ourselves so we can show errors
    });

    setIsLoading(false);

    if (result?.error) {
      setError("Email ou mot de passe incorrect.");
      return;
    }

    router.push("/dashboard");
    router.refresh(); // force Server Components to re-read the session
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="vous@novity.fr"
        required
        autoComplete="email"
      />
      <Input
        label="Mot de passe"
        name="password"
        type="password"
        placeholder="••••••••"
        required
        autoComplete="current-password"
      />

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </p>
      )}

      <Button type="submit" isLoading={isLoading} className="w-full mt-1">
        Se connecter
      </Button>
    </form>
  );
}
