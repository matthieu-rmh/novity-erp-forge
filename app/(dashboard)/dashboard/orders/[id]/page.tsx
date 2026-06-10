import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { StatusPill, ORDER_FLOW, ORDER_STATUS } from "@/components/ui/StatusPill";
import type { OrderStatus } from "@/components/ui/StatusPill";
import { StatusStepper } from "@/components/orders/StatusStepper";
import { updateOrderStatus, deleteOrder } from "@/app/(dashboard)/dashboard/orders/actions";
import {
  XIcon,
  ChevronRightIcon,
  MailIcon,
  PhoneIcon,
  BuildingIcon,
  TrashIcon,
} from "@/components/ui/icons";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

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

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      contact: true,
      lines: { include: { product: true } },
    },
  });

  if (!order) {
    notFound();
  }

  const status = order.status as OrderStatus;
  const contact = order.contact;

  const subtotal = order.lines.reduce(
    (s: number, l: { total: number }) => s + l.total,
    0
  );
  const vat = +(subtotal * 0.2).toFixed(2);
  const ttc = +(subtotal + vat).toFixed(2);
  const totalQty = order.lines.reduce(
    (s: number, l: { quantity: number }) => s + l.quantity,
    0
  );

  const curIdx = ORDER_FLOW.indexOf(status);
  const nextStatus =
    status !== "CANCELLED" && curIdx >= 0 && curIdx < ORDER_FLOW.length - 1
      ? ORDER_FLOW[curIdx + 1]
      : null;
  const canCancel = status === "DRAFT" || status === "CONFIRMED";
  const canDelete = status === "DRAFT";

  const updateStatusWithId = updateOrderStatus.bind(null, order.id);
  const deleteOrderWithId = deleteOrder.bind(null, order.id);

  return (
    <div>
      <PageHeader
        backHref="/dashboard/orders"
        badge="Commandes"
        badgeColor="lavender"
        title={order.reference}
        subtitle={`Créée le ${fmtDate(order.createdAt)} · ${contact.firstName} ${contact.lastName}`}
        actions={
          <>
            {canDelete && (
              <form action={deleteOrderWithId}>
                <Button variant="ghost" size="sm" type="submit">
                  <TrashIcon size={14} />
                  Supprimer
                </Button>
              </form>
            )}
            {canCancel && (
              <form action={updateStatusWithId.bind(null, "CANCELLED")}>
                <Button variant="danger" size="sm" type="submit">
                  <XIcon size={14} />
                  Annuler
                </Button>
              </form>
            )}
            {nextStatus && (
              <form action={updateStatusWithId.bind(null, nextStatus)}>
                <Button type="submit">
                  <ChevronRightIcon size={15} />
                  Passer à «&nbsp;{ORDER_STATUS[nextStatus].label}&nbsp;»
                </Button>
              </form>
            )}
          </>
        }
      />

      {/* Status stepper card */}
      <Card className="p-5 mb-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-gray">
              Statut
            </span>
            <StatusPill status={status} />
          </div>
          {status === "CANCELLED" ? (
            <p className="text-sm text-red-600 font-bold">
              Commande annulée — aucune action possible.
            </p>
          ) : (
            <StatusStepper status={status} />
          )}
        </div>
      </Card>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Order lines table — spans 2 cols */}
        <Card className="p-0 overflow-hidden lg:col-span-2">
          <div className="px-5 py-3.5 border-b border-brand-light-gray">
            <h3 className="font-bold text-brand-black">Lignes de commande</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-light-gray bg-brand-offwhite/50 text-[11px] uppercase tracking-wider text-brand-gray">
                <th className="text-left font-bold px-5 py-2">Produit</th>
                <th className="text-center font-bold px-3 py-2">Qté</th>
                <th className="text-right font-bold px-3 py-2 hidden sm:table-cell">
                  PU HT
                </th>
                <th className="text-right font-bold px-5 py-2">Total HT</th>
              </tr>
            </thead>
            <tbody>
              {order.lines.map((line: { id: string; product: { name: string; sku: string }; quantity: number; unitPrice: number; total: number }) => (
                <tr
                  key={line.id}
                  className="border-b border-brand-light-gray last:border-0"
                >
                  <td className="px-5 py-3">
                    <p className="font-medium text-brand-black">
                      {line.product.name}
                    </p>
                    <p className="text-xs text-brand-gray font-mono">
                      {line.product.sku}
                    </p>
                  </td>
                  <td className="px-3 py-3 text-center text-brand-dark-gray">
                    {line.quantity}
                  </td>
                  <td className="px-3 py-3 text-right text-brand-dark-gray hidden sm:table-cell">
                    {fmtEUR(line.unitPrice)}
                  </td>
                  <td className="px-5 py-3 text-right font-bold text-brand-black">
                    {fmtEUR(line.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Totals footer */}
          <div className="px-5 py-4 bg-brand-offwhite/40 border-t border-brand-light-gray">
            <div className="ml-auto max-w-xs flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-brand-dark-gray">Sous-total HT</span>
                <span className="font-bold text-brand-black">
                  {fmtEUR(subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-gray">TVA 20 %</span>
                <span className="font-bold text-brand-black">{fmtEUR(vat)}</span>
              </div>
              <div className="border-t border-brand-light-gray my-1" />
              <div className="flex justify-between">
                <span className="text-brand-dark-gray font-bold">Total TTC</span>
                <span className="text-lg font-black text-brand-black">
                  {fmtEUR(ttc)}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Side column */}
        <div className="flex flex-col gap-5">
          {/* Client card */}
          <Card className="p-5">
            <h3 className="font-bold text-brand-black mb-3">Client</h3>
            <Link
              href={`/dashboard/crm/${order.contactId}`}
              className="w-full flex items-center gap-3 text-left group"
            >
              <Avatar
                firstName={contact.firstName}
                lastName={contact.lastName}
                size={44}
              />
              <div className="min-w-0">
                <p className="font-bold text-brand-black truncate group-hover:underline">
                  {contact.firstName} {contact.lastName}
                </p>
                {(contact.title ?? contact.company) && (
                  <p className="text-xs text-brand-gray truncate">
                    {[contact.title, contact.company]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
              </div>
            </Link>
            <div className="mt-4 pt-4 border-t border-brand-light-gray flex flex-col gap-2.5">
              <span className="inline-flex items-center gap-2 text-xs text-brand-gray">
                <MailIcon size={13} />
                {contact.email}
              </span>
              {contact.phone && (
                <span className="inline-flex items-center gap-2 text-xs text-brand-gray">
                  <PhoneIcon size={13} />
                  {contact.phone}
                </span>
              )}
              {contact.company && (
                <span className="inline-flex items-center gap-2 text-xs text-brand-gray">
                  <BuildingIcon size={13} />
                  {contact.company}
                </span>
              )}
            </div>
          </Card>

          {/* Summary card */}
          <Card className="p-5">
            <h3 className="font-bold text-brand-black mb-3">Récapitulatif</h3>
            <div className="flex flex-col gap-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-brand-gray">Articles</span>
                <span className="font-bold text-brand-black">{totalQty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-gray">Références</span>
                <span className="font-bold text-brand-black">
                  {order.lines.length}
                </span>
              </div>
              <div className="border-t border-brand-light-gray my-0.5" />
              <div className="flex justify-between">
                <span className="text-brand-dark-gray font-bold">Total TTC</span>
                <span className="text-lg font-black text-brand-black">
                  {fmtEUR(ttc)}
                </span>
              </div>
            </div>
          </Card>

          {/* Notes card — only if notes exist */}
          {order.notes && (
            <Card className="p-5">
              <h3 className="font-bold text-brand-black mb-2">Notes</h3>
              <p className="text-sm text-brand-dark-gray whitespace-pre-line">
                {order.notes}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
