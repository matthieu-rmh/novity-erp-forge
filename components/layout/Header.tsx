/*
  Server Component — reads the session server-side via getServerSession().
  No client-side JS needed to display the user name and role.

  The logout button IS interactive (calls signOut), so it's extracted
  into a small Client Component to avoid making the whole Header a client component.
*/

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Badge } from "@/components/ui/Badge";
import { LogoutButton } from "./LogoutButton";

const roleBadgeColor: Record<string, "black" | "peach" | "gray"> = {
  ADMIN:   "black",
  MANAGER: "peach",
  USER:    "gray",
};

export async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="h-14 bg-brand-white border-b border-brand-light-gray px-6 flex items-center justify-between flex-shrink-0">
      {/* Left: page breadcrumb — filled in by each page via a slot or portal later */}
      <div />

      {/* Right: user info + logout */}
      {session?.user && (
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-brand-black leading-none">
              {session.user.name ?? session.user.email}
            </p>
            <p className="text-xs text-brand-gray mt-0.5">
              {session.user.email}
            </p>
          </div>
          <Badge color={roleBadgeColor[session.user.role] ?? "gray"}>
            {session.user.role}
          </Badge>
          <LogoutButton />
        </div>
      )}
    </header>
  );
}
