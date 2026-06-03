/*
  Dashboard layout — wraps all pages under /dashboard/*.

  Structure:
    <Sidebar>  ← fixed left column, 224px wide, dark bg
    <main>
      <Header> ← top bar, 56px tall, shows user + logout
      <content> ← scrollable page content
    </main>

  This layout is a Server Component (no "use client").
  The Sidebar is a Client Component (needs usePathname).
  The Header is a Server Component (reads session server-side).
  They each carry only the interactivity they need — this is the
  key App Router pattern to keep in mind.
*/

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-brand-offwhite px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
