import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusPill } from "@/components/ui/StatusPill";
import type { OrderStatus } from "@/components/ui/StatusPill";
import {
  PlusIcon,
  ChevronRightIcon,
  DocIcon,
} from "@/components/ui/icons";

interface OrdersPageProps {
  searchParams: Promise<{ tab?: string; search?: string; page?: string }>;
}

const ORDER_TABS: { id: string; label: string }[] = [
  { id: "all", label: "Toutes" },
  { id: "DRAFT", label: "Brouillon" },
  { id: "CONFIRMED", label: "Confirmée" },
  { id: "SHIPPED", label: "Expédiée" },
  { id: "DELIVERED", label: "Livrée" },
  { id: "CANCELLED", label: "Annulée" },
];

const VALID_STATUSES: OrderStatus[] = [
  "DRAFT",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const fmtDate = (date: Date) =>
  new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);

const fmtEUR = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
    n
  );

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const { tab = "all", search = "", page = "1" } = await searchParams;

  const PAGE_SIZE = 20;
  const skip = (Math.max(1, parseInt(page)) - 1) * PAGE_SIZE;

  const statusFilter =
    tab !== "all" && VALID_STATUSES.includes(tab as OrderStatus)
      ? (tab as OrderStatus)
      : undefined;

  const searchFilter = search.trim()
    ? {
        OR: [
          { reference: { contains: search, mode: "insensitive" as const } },
          {
            contact: {
              OR: [
                {
                  firstName: { contains: search, mode: "insensitive" as const },
                },
                {
                  lastName: { contains: search, mode: "insensitive" as const },
                },
                { email: { contains: search, mode: "insensitive" as const } },
                {
                  company: { contains: search, mode: "insensitive" as const },
                },
              ],
            },
          },
        ],
      }
    : {};

  const where = {
    ...(statusFilter ? { status: statusFilter } : {}),
    ...searchFilter,
  };

  const [orders, total, statusCounts, revenue] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { contact: true, lines: true },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip,
    }),
    prisma.order.count({ where }),
    prisma.order.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    prisma.order.aggregate({
      where: { status: { not: "CANCELLED" } },
      _sum: { total: true },
    }),
  ]);

  const counts: Record<string, number> = { all: 0 };
  for (const s of VALID_STATUSES) counts[s] = 0;
  for (const row of statusCounts) {
    counts[row.status] = row._count._all;
    counts.all += row._count._all;
  }

  const revenueTotal = revenue._sum.total ?? 0;

  return (
    <div>
      <PageHeader
        badge="Commandes"
        badgeColor="lavender"
        title="Commandes"
        subtitle={`${counts.all} commande${counts.all !== 1 ? "s" : ""} · ${fmtEUR(revenueTotal)} de chiffre d'affaires`}
        actions={
          <Link href="/dashboard/orders/new">
            <Button>
              <PlusIcon size={15} />
              Nouvelle commande
            </Button>
          </Link>
        }
      />

      {/* Status tabs */}
      <div className="flex items-center gap-1 border-b border-brand-light-gray mb-4 overflow-x-auto">
        {ORDER_TABS.map((tb) => {
          const active = tab === tb.id;
          return (
            <Link
              key={tb.id}
              href={`?tab=${tb.id}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
              className={`relative px-3.5 py-2.5 text-sm font-bold whitespace-nowrap transition-colors ${
                active
                  ? "text-brand-black"
                  : "text-brand-gray hover:text-brand-dark-gray"
              }`}
            >
              {tb.label}
              <span
                className={`ml-1.5 text-xs font-medium ${active ? "text-brand-dark-gray" : "text-brand-gray"}`}
              >
                {counts[tb.id] ?? 0}
              </span>
              {active && (
                <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-brand-black" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Search */}
      <div className="mb-4">
        <form method="GET">
          {tab !== "all" && <input type="hidden" name="tab" value={tab} />}
          <input
            type="search"
            name="search"
            defaultValue={search}
            placeholder="Rechercher une référence, un client…"
            className="w-full max-w-sm rounded border border-brand-light-gray bg-white px-3 py-2 text-sm text-brand-black placeholder:text-brand-gray focus:outline-none focus:ring-2 focus:ring-brand-black"
          />
        </form>
      </div>

      {/* Table */}
      {orders.length === 0 ? (
        <EmptyState
          icon={<DocIcon size={20} />}
          title="Aucune commande"
          hint={
            search
              ? "Aucun résultat pour cette recherche."
              : "Créez votre première commande pour commencer."
          }
          action={
            !search ? (
              <Link href="/dashboard/orders/new">
                <Button size="sm">
                  <PlusIcon size={14} />
                  Nouvelle commande
                </Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-light-gray bg-brand-offwhite/60 text-[11px] uppercase tracking-wider text-brand-gray">
                <th className="text-left font-bold px-4 py-2.5">Référence</th>
                <th className="text-left font-bold px-4 py-2.5">Client</th>
                <th className="text-left font-bold px-4 py-2.5 hidden md:table-cell">
                  Date
                </th>
                <th className="text-center font-bold px-4 py-2.5 hidden sm:table-cell">
                  Lignes
                </th>
                <th className="text-left font-bold px-4 py-2.5">Statut</th>
                <th className="text-right font-bold px-4 py-2.5">Total</th>
                <th className="px-4 py-2.5 w-8" />
              </tr>
            </thead>
            <tbody>
              {orders.map((order: {
                id: string;
                reference: string;
                status: string;
                total: number;
                createdAt: Date;
                contact: { firstName: string; lastName: string; company: string | null };
                lines: { id: string }[];
              }) => (
                <tr
                  key={order.id}
                  className="border-b border-brand-light-gray last:border-0 hover:bg-brand-offwhite/50 transition-colors group"
                >
                  <td className="px-4 py-3 font-bold text-brand-black">
                    <Link
                      href={`/dashboard/orders/${order.id}`}
                      className="hover:underline"
                    >
                      {order.reference}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/orders/${order.id}`}
                      className="flex items-center gap-2.5"
                    >
                      <Avatar
                        firstName={order.contact.firstName}
                        lastName={order.contact.lastName}
                        size={28}
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-brand-black truncate">
                          {order.contact.firstName} {order.contact.lastName}
                        </p>
                        {order.contact.company && (
                          <p className="text-xs text-brand-gray truncate">
                            {order.contact.company}
                          </p>
                        )}
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-brand-gray hidden md:table-cell">
                    {fmtDate(order.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-center text-brand-dark-gray hidden sm:table-cell">
                    {order.lines.length}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={order.status as OrderStatus} />
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-brand-black">
                    {fmtEUR(order.total)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/dashboard/orders/${order.id}`}>
                      <ChevronRightIcon
                        size={16}
                        className="text-brand-light-gray group-hover:text-brand-dark-gray transition-colors"
                      />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Pagination */}
      {total > PAGE_SIZE && (
        <div className="flex items-center justify-between mt-4 text-sm text-brand-gray">
          <span>
            {skip + 1}–{Math.min(skip + orders.length, total)} sur {total}
          </span>
          <div className="flex gap-2">
            {skip > 0 && (
              <Link
                href={`?tab=${tab}&search=${encodeURIComponent(search)}&page=${parseInt(page) - 1}`}
              >
                <Button variant="secondary" size="sm">
                  Précédent
                </Button>
              </Link>
            )}
            {skip + PAGE_SIZE < total && (
              <Link
                href={`?tab=${tab}&search=${encodeURIComponent(search)}&page=${parseInt(page) + 1}`}
              >
                <Button variant="secondary" size="sm">
                  Suivant
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
