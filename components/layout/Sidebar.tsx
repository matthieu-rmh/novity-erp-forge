"use client";

/*
  Client Component because usePathname() requires the client.
  The sidebar itself has no data fetching — it only reads the URL to
  highlight the active link. Everything else is static markup.
*/

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
  accent: "lavender" | "mint" | "peach";
};

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard",  href: "/dashboard",         accent: "mint"     },
  { label: "CRM",        href: "/dashboard/crm",     accent: "lavender" },
  { label: "Commandes",  href: "/dashboard/orders",  accent: "lavender" },
  { label: "Stock",      href: "/dashboard/stock",   accent: "mint"     },
  { label: "Factures",   href: "/dashboard/invoices",accent: "mint"     },
];

const accentBorder: Record<NavItem["accent"], string> = {
  lavender: "border-l-brand-lavender",
  mint:     "border-l-brand-mint",
  peach:    "border-l-brand-peach",
};

const accentText: Record<NavItem["accent"], string> = {
  lavender: "text-brand-lavender",
  mint:     "text-brand-mint",
  peach:    "text-brand-peach",
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 min-h-screen bg-brand-black flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/10">
        <span className="text-xl font-black text-brand-white tracking-tight">
          NOVITY
        </span>
        <span className="block text-xs text-brand-gray italic mt-0.5">
          ERP
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={[
                    "flex items-center px-5 py-2.5 text-sm transition-colors duration-100",
                    "border-l-4",
                    isActive
                      ? `border-l-4 ${accentBorder[item.accent]} ${accentText[item.accent]} font-bold bg-white/5`
                      : "border-l-transparent text-brand-gray hover:text-brand-white hover:bg-white/5",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/10">
        <p className="text-xs text-brand-gray">v0.1.0 — inter-contrat</p>
      </div>
    </aside>
  );
}
