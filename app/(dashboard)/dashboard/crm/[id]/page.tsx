import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusPill } from "@/components/ui/StatusPill";
import { PlusIcon, EditIcon, MailIcon, PhoneIcon, BuildingIcon, CalendarIcon, DocIcon } from "@/components/ui/icons";
import { deleteContact } from "@/app/(dashboard)/dashboard/crm/actions";
import type { ContactStatus } from "@/app/generated/prisma/client";

const CONTACT_STATUS: Record<ContactStatus, { label: string; dot: string; badge: "mint" | "lavender" | "gray" }> = {
  CLIENT:   { label: "Client",   dot: "#5FC9A8", badge: "mint" },
  PROSPECT: { label: "Prospect", dot: "#9B9BE0", badge: "lavender" },
  INACTIF:  { label: "Inactif",  dot: "#B8B8B8", badge: "gray" },
};

const fmtEUR = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);

const fmtDate = (d: Date) =>
  new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(d);

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const contact = await prisma.contact.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: { lines: { select: { id: true } } },
      },
    },
  });

  if (!contact) notFound();

  const statusConfig = CONTACT_STATUS[contact.status];
  const totalRevenue = contact.orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((s, o) => s + o.total, 0);

  const deleteAction = deleteContact.bind(null, id);

  return (
    <div>
      <PageHeader
        backHref="/dashboard/crm"
        badge="CRM"
        badgeColor="lavender"
        title={`${contact.firstName} ${contact.lastName}`}
        subtitle={[contact.title, contact.company].filter(Boolean).join(" · ") || undefined}
        actions={
          <>
            <Link href={`/dashboard/crm/${id}/edit`}>
              <Button variant="secondary">
                <EditIcon size={14} />
                Modifier
              </Button>
            </Link>
            <Link href={`/dashboard/orders/new?contactId=${id}`}>
              <Button>
                <PlusIcon size={15} />
                Nouvelle commande
              </Button>
            </Link>
          </>
        }
      />

      {/* Identity strip */}
      <Card className="p-5 mb-5">
        <div className="flex flex-wrap items-center gap-5">
          <Avatar firstName={contact.firstName} lastName={contact.lastName} size={64} />
          <div className="flex flex-col gap-1.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-dark-gray">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusConfig.dot }} />
              {statusConfig.label}
            </span>
            <Badge color={statusConfig.badge}>{statusConfig.label}</Badge>
          </div>
          <div className="flex-1" />
          <div className="flex items-stretch gap-6 text-center">
            <div className="px-2">
              <p className="text-2xl font-black text-brand-black">{contact.orders.length}</p>
              <p className="text-xs text-brand-gray">Commandes</p>
            </div>
            <div className="px-2 border-l border-brand-light-gray">
              <p className="text-2xl font-black text-brand-black">{fmtEUR(totalRevenue)}</p>
              <p className="text-xs text-brand-gray">Chiffre d'affaires</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main column */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Orders table */}
          <Card className="p-0 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-brand-light-gray">
              <h3 className="font-bold text-brand-black">Commandes</h3>
              <Link href={`/dashboard/orders/new?contactId=${id}`}>
                <Button variant="ghost" size="sm">
                  <PlusIcon size={14} />
                  Ajouter
                </Button>
              </Link>
            </div>
            {contact.orders.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-brand-light-gray bg-brand-offwhite/50 text-[11px] uppercase tracking-wider text-brand-gray">
                    <th className="text-left font-bold px-5 py-2">Référence</th>
                    <th className="text-left font-bold px-5 py-2">Date</th>
                    <th className="text-left font-bold px-5 py-2">Statut</th>
                    <th className="text-right font-bold px-5 py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {contact.orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-brand-light-gray last:border-0"
                    >
                      <td className="px-5 py-3">
                        <Link
                          href={`/dashboard/orders/${order.id}`}
                          className="font-bold text-brand-black hover:underline"
                        >
                          {order.reference}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-brand-gray">{fmtDate(order.createdAt)}</td>
                      <td className="px-5 py-3"><StatusPill status={order.status} /></td>
                      <td className="px-5 py-3 text-right font-bold text-brand-black">{fmtEUR(order.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="px-5">
                <EmptyState
                  icon={<DocIcon size={20} />}
                  title="Aucune commande"
                  hint="Ce contact n'a pas encore de commande."
                />
              </div>
            )}
          </Card>

          {/* Notes */}
          {contact.notes && (
            <Card className="p-5">
              <h3 className="font-bold text-brand-black mb-2">Notes</h3>
              <p className="text-sm text-brand-dark-gray leading-relaxed">{contact.notes}</p>
            </Card>
          )}
        </div>

        {/* Side column */}
        <div className="flex flex-col gap-5">
          {/* Coordonnées */}
          <Card className="p-5">
            <h3 className="font-bold text-brand-black mb-4">Coordonnées</h3>
            <div className="flex flex-col gap-3.5">
              <div className="flex items-start gap-3">
                <span className="text-brand-gray mt-0.5"><MailIcon size={15} /></span>
                <div><p className="text-xs text-brand-gray">Email</p><p className="text-sm text-brand-black font-medium break-all">{contact.email}</p></div>
              </div>
              {contact.phone && (
                <div className="flex items-start gap-3">
                  <span className="text-brand-gray mt-0.5"><PhoneIcon size={15} /></span>
                  <div><p className="text-xs text-brand-gray">Téléphone</p><p className="text-sm text-brand-black font-medium">{contact.phone}</p></div>
                </div>
              )}
              {contact.company && (
                <div className="flex items-start gap-3">
                  <span className="text-brand-gray mt-0.5"><BuildingIcon size={15} /></span>
                  <div><p className="text-xs text-brand-gray">Entreprise</p><p className="text-sm text-brand-black font-medium">{contact.company}</p></div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <span className="text-brand-gray mt-0.5"><CalendarIcon size={15} /></span>
                <div><p className="text-xs text-brand-gray">Client depuis</p><p className="text-sm text-brand-black font-medium">{fmtDate(contact.createdAt)}</p></div>
              </div>
            </div>
          </Card>

          {/* Danger zone */}
          <Card className="p-5 border-red-100">
            <h3 className="font-bold text-sm text-brand-dark-gray mb-3">Zone de danger</h3>
            <p className="text-xs text-brand-gray mb-3">
              Supprimer ce contact est irréversible. Les commandes associées seront conservées.
            </p>
            <form action={deleteAction}>
              <Button variant="danger" size="sm" type="submit">
                Supprimer ce contact
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
