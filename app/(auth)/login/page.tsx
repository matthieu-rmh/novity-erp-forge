import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "Connexion — NOVITY ERP",
};

/*
  Server Component page — renders the static shell (title, badge, card).
  The form itself (LoginForm) is a Client Component because it uses
  next-auth/react's signIn(), useState for error messages, and useRouter
  for post-login redirect.

  Rule: Server Components for layout/shell, Client Components only where
  interactivity is needed. This keeps the initial HTML payload minimal.
*/
export default function LoginPage() {
  return (
    <div className="w-full max-w-sm">
      {/* NOVITY brand header */}
      <div className="text-center mb-8">
        <span className="inline-block bg-brand-peach text-brand-black text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-3">
          Auth
        </span>
        <h1 className="text-3xl font-black text-brand-black">NOVITY ERP</h1>
        <p className="text-sm text-brand-gray mt-1 italic">
          Connexion à votre espace
        </p>
      </div>

      {/* Login card */}
      <div className="bg-brand-white border border-brand-light-gray rounded p-8">
        <LoginForm />
      </div>
    </div>
  );
}
