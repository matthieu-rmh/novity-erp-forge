"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { PlusIcon, TrashIcon, CheckIcon } from "@/components/ui/icons";

interface ContactOption {
  id: string;
  firstName: string;
  lastName: string;
  company: string | null;
}

interface ProductOption {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
}

interface LineState {
  key: number;
  productId: string;
  quantity: number;
}

interface OrderFormProps {
  contacts: ContactOption[];
  products: ProductOption[];
  presetContactId?: string;
  action: (data: {
    contactId: string;
    notes: string;
    lines: { productId: string; quantity: number; unitPrice: number }[];
    status?: "DRAFT" | "CONFIRMED";
  }) => Promise<void>;
}

const fmtEUR = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
    n
  );

let keyCounter = 0;
function nextKey() {
  return ++keyCounter;
}

export function OrderForm({
  contacts,
  products,
  presetContactId,
  action,
}: OrderFormProps) {
  const [contactId, setContactId] = useState(
    presetContactId ?? contacts[0]?.id ?? ""
  );
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<LineState[]>([
    { key: nextKey(), productId: products[0]?.id ?? "", quantity: 1 },
  ]);
  const [isPending, startTransition] = useTransition();

  function addLine() {
    setLines((prev) => [
      ...prev,
      { key: nextKey(), productId: products[0]?.id ?? "", quantity: 1 },
    ]);
  }

  function removeLine(key: number) {
    setLines((prev) => prev.filter((l) => l.key !== key));
  }

  function setLine(key: number, patch: Partial<Omit<LineState, "key">>) {
    setLines((prev) =>
      prev.map((l) => (l.key === key ? { ...l, ...patch } : l))
    );
  }

  function buildPayload(status: "DRAFT" | "CONFIRMED") {
    return {
      contactId,
      notes,
      status,
      lines: lines.map((l) => {
        const product = products.find((p) => p.id === l.productId)!;
        return {
          productId: l.productId,
          quantity: Math.max(1, l.quantity),
          unitPrice: product.price,
        };
      }),
    };
  }

  function submit(status: "DRAFT" | "CONFIRMED") {
    startTransition(async () => {
      await action(buildPayload(status));
    });
  }

  const subtotal = lines.reduce((sum, l) => {
    const product = products.find((p) => p.id === l.productId);
    return sum + (product?.price ?? 0) * Math.max(0, l.quantity);
  }, 0);
  const vat = +(subtotal * 0.2).toFixed(2);
  const ttc = +(subtotal + vat).toFixed(2);
  const totalQty = lines.reduce((s, l) => s + Math.max(0, l.quantity), 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 flex flex-col gap-5">
        {/* Contact selection */}
        <Card className="p-5">
          <h3 className="font-bold text-brand-black mb-3">Client</h3>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-wider text-brand-dark-gray">
              Sélectionner un contact
            </label>
            <select
              value={contactId}
              onChange={(e) => setContactId(e.target.value)}
              className="w-full appearance-none rounded border border-brand-light-gray bg-white pl-3 pr-8 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-black cursor-pointer"
            >
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.lastName} {c.firstName}
                  {c.company ? ` — ${c.company}` : ""}
                </option>
              ))}
            </select>
          </div>
          {contactId && (() => {
            const contact = contacts.find((c) => c.id === contactId);
            if (!contact) return null;
            return (
              <div className="mt-3 flex items-center gap-2.5 p-3 rounded bg-brand-offwhite border border-brand-light-gray">
                <Avatar
                  firstName={contact.firstName}
                  lastName={contact.lastName}
                  size={32}
                />
                <div>
                  <p className="text-sm font-bold text-brand-black">
                    {contact.firstName} {contact.lastName}
                  </p>
                  {contact.company && (
                    <p className="text-xs text-brand-gray">{contact.company}</p>
                  )}
                </div>
              </div>
            );
          })()}
        </Card>

        {/* Line items */}
        <Card className="p-0 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-brand-light-gray flex items-center justify-between">
            <h3 className="font-bold text-brand-black">Lignes</h3>
            <Button variant="secondary" size="sm" onClick={addLine} type="button">
              <PlusIcon size={14} />
              Ajouter une ligne
            </Button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-light-gray bg-brand-offwhite/60 text-[11px] uppercase tracking-wider text-brand-gray">
                <th className="text-left font-bold px-5 py-2.5">Produit</th>
                <th className="text-center font-bold px-3 py-2.5 w-24">Qté</th>
                <th className="text-right font-bold px-3 py-2.5 hidden sm:table-cell">
                  PU HT
                </th>
                <th className="text-right font-bold px-5 py-2.5">Total HT</th>
                <th className="px-3 py-2.5 w-10" />
              </tr>
            </thead>
            <tbody>
              {lines.map((line) => {
                const product = products.find((p) => p.id === line.productId);
                const lineTotal = product
                  ? +(product.price * Math.max(0, line.quantity)).toFixed(2)
                  : 0;
                return (
                  <tr
                    key={line.key}
                    className="border-b border-brand-light-gray last:border-0"
                  >
                    <td className="px-5 py-2.5">
                      <select
                        value={line.productId}
                        onChange={(e) =>
                          setLine(line.key, { productId: e.target.value })
                        }
                        className="w-full appearance-none rounded border border-brand-light-gray bg-white pl-2.5 pr-8 py-1.5 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-black cursor-pointer"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                      {product && (
                        <p className="text-xs text-brand-gray font-mono mt-1">
                          {product.sku}
                          {product.stock < 5 && (
                            <span className="ml-2 text-orange-600 font-bold">
                              Stock faible ({product.stock})
                            </span>
                          )}
                        </p>
                      )}
                    </td>
                    <td className="px-3 py-2.5 w-24">
                      <input
                        type="number"
                        min="1"
                        value={line.quantity}
                        onChange={(e) =>
                          setLine(line.key, {
                            quantity: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full rounded border border-brand-light-gray px-2 py-1.5 text-sm text-center text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-black"
                      />
                    </td>
                    <td className="px-3 py-2.5 text-right text-brand-dark-gray hidden sm:table-cell">
                      {product ? fmtEUR(product.price) : "—"}
                    </td>
                    <td className="px-5 py-2.5 text-right font-bold text-brand-black">
                      {fmtEUR(lineTotal)}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => removeLine(line.key)}
                        disabled={lines.length === 1}
                        className="text-brand-gray hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <TrashIcon size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        {/* Notes */}
        <Card className="p-5">
          <h3 className="font-bold text-brand-black mb-3">Notes</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Informations complémentaires, instructions de livraison…"
            className="w-full rounded border border-brand-light-gray px-3 py-2 text-sm text-brand-black bg-white placeholder:text-brand-gray resize-none focus:outline-none focus:ring-2 focus:ring-brand-black focus:ring-offset-1"
          />
        </Card>
      </div>

      {/* Sticky summary rail */}
      <div>
        <Card className="p-5 lg:sticky lg:top-4">
          <h3 className="font-bold text-brand-black mb-4">Récapitulatif</h3>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-brand-gray">Articles</span>
              <span className="font-bold text-brand-black">{totalQty}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-gray">Références</span>
              <span className="font-bold text-brand-black">{lines.length}</span>
            </div>
            <div className="border-t border-brand-light-gray my-1" />
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
          <div className="flex flex-col gap-2 mt-5">
            <Button
              onClick={() => submit("CONFIRMED")}
              disabled={isPending || lines.length === 0 || !contactId}
              isLoading={isPending}
              type="button"
            >
              <CheckIcon size={15} />
              Créer et confirmer
            </Button>
            <Button
              variant="secondary"
              onClick={() => submit("DRAFT")}
              disabled={isPending || lines.length === 0 || !contactId}
              type="button"
            >
              Enregistrer en brouillon
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
