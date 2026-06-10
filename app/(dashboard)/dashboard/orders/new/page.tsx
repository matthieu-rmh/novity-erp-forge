import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { OrderForm } from "@/components/orders/OrderForm";
import { createOrder } from "@/app/(dashboard)/dashboard/orders/actions";

interface NewOrderPageProps {
  searchParams: Promise<{ contactId?: string }>;
}

export default async function NewOrderPage({ searchParams }: NewOrderPageProps) {
  const { contactId } = await searchParams;

  const [contacts, products] = await Promise.all([
    prisma.contact.findMany({
      orderBy: { lastName: "asc" },
      select: { id: true, firstName: true, lastName: true, company: true },
    }),
    prisma.product.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, sku: true, price: true, stock: true },
    }),
  ]);

  return (
    <div>
      <PageHeader
        backHref="/dashboard/orders"
        badge="Commandes"
        badgeColor="lavender"
        title="Nouvelle commande"
        subtitle="Composez la commande, le total est calculé en direct (et revérifié côté serveur)."
      />
      <OrderForm
        contacts={contacts}
        products={products}
        presetContactId={contactId}
        action={createOrder}
      />
    </div>
  );
}
