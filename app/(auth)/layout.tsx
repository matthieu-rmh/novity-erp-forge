/*
  Route group (auth) — the parentheses mean this folder is invisible in the URL.
  /login maps to app/(auth)/login/page.tsx, not /auth/login.

  This layout wraps only the login page. It's minimal — just centers the card
  on the offwhite background. The dashboard layout (with sidebar + header) is
  a separate layout in app/(dashboard)/layout.tsx.
*/

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-offwhite flex items-center justify-center px-4">
      {children}
    </div>
  );
}
