import { PageHeader } from "@/components/ui/PageHeader";
import { ContactForm } from "@/components/crm/ContactForm";
import { createContact } from "@/app/(dashboard)/dashboard/crm/actions";

export const metadata = {
  title: "Nouveau contact — CRM",
};

export default function NewContactPage() {
  return (
    <div className="max-w-3xl">
      <PageHeader
        backHref="/dashboard/crm"
        badge="CRM"
        badgeColor="lavender"
        title="Nouveau contact"
        subtitle="Créez une fiche contact dans le CRM."
      />
      <ContactForm
        action={createContact}
        submitLabel="Créer le contact"
        cancelHref="/dashboard/crm"
      />
    </div>
  );
}
