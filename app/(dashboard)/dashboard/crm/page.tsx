import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { PlusIcon } from "@/components/ui/icons";
import { ContactsTable } from "@/components/crm/ContactsTable";
import { CRMSearchInput } from "./CRMSearchInput";
import type { ContactStatus, Prisma } from "@/app/generated/prisma/client";

const PAGE_SIZE = 8;

const STATUS_FILTERS = [
  { id: "all",      label: "Tous"      },
  { id: "CLIENT",   label: "Clients"   },
  { id: "PROSPECT", label: "Prospects" },
  { id: "INACTIF",  label: "Inactifs"  },
] as const;

interface SearchParams {
  search?: string;
  status?: string;
  sort?: string;
  dir?: string;
  page?: string;
}

export default async function CRMPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const search = params.search?.trim() ?? "";
  const statusFilter = params.status ?? "all";
  const sort = (params.sort ?? "createdAt") as keyof Pick<
    Prisma.ContactOrderByWithRelationInput,
    "firstName" | "company" | "status" | "createdAt"
  >;
  const dir = (params.dir === "asc" ? "asc" : "desc") as "asc" | "desc";
  const page = Math.max(0, parseInt(params.page ?? "0", 10) || 0);

  const where: Prisma.ContactWhereInput = {
    ...(statusFilter !== "all" && {
      status: statusFilter as ContactStatus,
    }),
    ...(search && {
      OR: [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName:  { contains: search, mode: "insensitive" } },
        { email:     { contains: search, mode: "insensitive" } },
        { company:   { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [contacts, total, clientCount, prospectCount] = await Promise.all([
    prisma.contact.findMany({
      where,
      orderBy: { [sort]: dir },
      skip: page * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { _count: { select: { orders: true } } },
    }),
    prisma.contact.count({ where }),
    prisma.contact.count({ where: { status: "CLIENT" } }),
    prisma.contact.count({ where: { status: "PROSPECT" } }),
  ]);

  const pageCount = Math.ceil(total / PAGE_SIZE);

  function buildFilterHref(id: string) {
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    if (id !== "all") p.set("status", id);
    p.set("page", "0");
    return `/dashboard/crm${p.size > 0 ? `?${p.toString()}` : ""}`;
  }

  return (
    <div>
      <PageHeader
        badge="CRM"
        badgeColor="lavender"
        title="Contacts"
        subtitle={`${total} contact${total !== 1 ? "s" : ""} · ${clientCount} client${clientCount !== 1 ? "s" : ""} · ${prospectCount} prospect${prospectCount !== 1 ? "s" : ""}`}
        actions={
          <Link href="/dashboard/crm/new">
            <Button>
              <PlusIcon size={15} />
              Nouveau contact
            </Button>
          </Link>
        }
      />

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 justify-between mb-4">
        {/* Status pill group */}
        <nav className="flex items-center bg-brand-offwhite border border-brand-light-gray rounded p-0.5 gap-0.5">
          {STATUS_FILTERS.map((f) => {
            const isActive = statusFilter === f.id;
            return (
              <Link
                key={f.id}
                href={buildFilterHref(f.id)}
                className={[
                  "px-3 py-1.5 rounded text-xs font-bold transition-colors",
                  isActive
                    ? "bg-brand-white shadow-sm text-brand-black"
                    : "text-brand-gray hover:text-brand-dark-gray",
                ].join(" ")}
              >
                {f.label}
              </Link>
            );
          })}
        </nav>

        {/* Search — client wrapper to avoid making the whole page a Client Component */}
        <CRMSearchInput defaultValue={search} />
      </div>

      <ContactsTable
        contacts={contacts}
        total={total}
        page={page}
        pageCount={pageCount}
      />
    </div>
  );
}
