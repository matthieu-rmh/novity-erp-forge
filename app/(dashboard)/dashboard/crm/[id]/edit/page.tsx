import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContactForm } from "@/components/crm/ContactForm";
import { updateContact } from "@/app/(dashboard)/dashboard/crm/actions";

export default async function EditContactPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const contact = await prisma.contact.findUnique({ where: { id } });
  if (!contact) notFound();

  const updateAction = updateContact.bind(null, id);

  return (
    <div className="max-w-3xl">
      <PageHeader
        backHref={`/dashboard/crm/${id}`}
        badge="CRM"
        badgeColor="lavender"
        title={`Modifier ${contact.firstName} ${contact.lastName}`}
        subtitle="Mettez à jour les informations du contact."
      />
      <ContactForm
        action={updateAction}
        defaultValues={{
          firstName: contact.firstName,
          lastName:  contact.lastName,
          email:     contact.email,
          phone:     contact.phone ?? undefined,
          company:   contact.company ?? undefined,
          title:     contact.title ?? undefined,
          status:    contact.status,
          notes:     contact.notes ?? undefined,
        }}
        submitLabel="Enregistrer"
        cancelHref={`/dashboard/crm/${id}`}
      />
    </div>
  );
}
