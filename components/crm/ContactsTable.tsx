"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { ArrowUpIcon, ArrowDownIcon, ChevronRightIcon, UsersIcon } from "@/components/ui/icons";
import type { Contact, ContactStatus } from "@/app/generated/prisma/client";

type ContactWithOrderCount = Contact & { _count: { orders: number } };

interface ContactsTableProps {
  contacts: ContactWithOrderCount[];
  total: number;
  page: number;
  pageCount: number;
}

const CONTACT_STATUS: Record<ContactStatus, { label: string; dot: string }> = {
  CLIENT:   { label: "Client",   dot: "#5FC9A8" },
  PROSPECT: { label: "Prospect", dot: "#9B9BE0" },
  INACTIF:  { label: "Inactif",  dot: "#B8B8B8" },
};

type SortField = "firstName" | "company" | "status" | "createdAt";
type SortDir = "asc" | "desc";

function SortHeader({
  field,
  label,
  currentSort,
  currentDir,
  onSort,
}: {
  field: SortField;
  label: string;
  currentSort: string;
  currentDir: SortDir;
  onSort: (field: SortField) => void;
}) {
  const isActive = currentSort === field;
  return (
    <button
      onClick={() => onSort(field)}
      className={[
        "inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider transition-colors",
        isActive
          ? "text-brand-black"
          : "text-brand-gray hover:text-brand-dark-gray",
      ].join(" ")}
    >
      {label}
      {isActive ? (
        currentDir === "asc" ? (
          <ArrowUpIcon size={11} />
        ) : (
          <ArrowDownIcon size={11} />
        )
      ) : null}
    </button>
  );
}

export function ContactsTable({
  contacts,
  total,
  page,
  pageCount,
}: ContactsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = (searchParams.get("sort") ?? "createdAt") as SortField;
  const currentDir = (searchParams.get("dir") ?? "desc") as SortDir;

  function handleSort(field: SortField) {
    const params = new URLSearchParams(searchParams.toString());
    if (currentSort === field) {
      params.set("dir", currentDir === "asc" ? "desc" : "asc");
    } else {
      params.set("sort", field);
      params.set("dir", "asc");
    }
    params.set("page", "0");
    router.push(`?${params.toString()}`);
  }

  function handlePage(p: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`?${params.toString()}`);
  }

  if (contacts.length === 0) {
    return (
      <Card className="p-0 overflow-hidden">
        <EmptyState
          icon={<UsersIcon />}
          title="Aucun contact trouvé"
          hint="Modifiez vos filtres ou créez un nouveau contact."
        />
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-light-gray bg-brand-offwhite/60">
              <th className="px-4 py-3 text-left">
                <SortHeader
                  field="firstName"
                  label="Contact"
                  currentSort={currentSort}
                  currentDir={currentDir}
                  onSort={handleSort}
                />
              </th>
              <th className="px-4 py-3 text-left">
                <SortHeader
                  field="company"
                  label="Entreprise"
                  currentSort={currentSort}
                  currentDir={currentDir}
                  onSort={handleSort}
                />
              </th>
              <th className="px-4 py-3 text-left">
                <SortHeader
                  field="status"
                  label="Statut"
                  currentSort={currentSort}
                  currentDir={currentDir}
                  onSort={handleSort}
                />
              </th>
              <th className="px-4 py-3 text-left hidden xl:table-cell">
                <SortHeader
                  field="createdAt"
                  label="Ajouté le"
                  currentSort={currentSort}
                  currentDir={currentDir}
                  onSort={handleSort}
                />
              </th>
              <th className="px-4 py-3 w-8" />
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => {
              const statusConfig = CONTACT_STATUS[contact.status];
              const date = new Intl.DateTimeFormat("fr-FR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }).format(new Date(contact.createdAt));

              return (
                <tr
                  key={contact.id}
                  onClick={() => router.push(`/dashboard/crm/${contact.id}`)}
                  className="border-b border-brand-light-gray last:border-0 cursor-pointer group hover:bg-brand-offwhite/70 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar
                        firstName={contact.firstName}
                        lastName={contact.lastName}
                        size={36}
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-brand-black leading-tight truncate">
                          {contact.firstName} {contact.lastName}
                        </p>
                        {contact.title && (
                          <p className="text-xs text-brand-gray truncate">
                            {contact.title}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-brand-dark-gray">
                      {contact.company ?? "—"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-dark-gray">
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: statusConfig.dot }}
                      />
                      {statusConfig.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden xl:table-cell text-xs text-brand-gray">
                    {date}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ChevronRightIcon
                      size={16}
                      className="text-brand-light-gray group-hover:text-brand-dark-gray transition-colors inline"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <div className="mt-4">
        <Pagination
          page={page}
          pageCount={pageCount}
          total={total}
          onPage={handlePage}
        />
      </div>
    </>
  );
}
