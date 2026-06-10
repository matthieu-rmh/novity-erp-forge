"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { CheckIcon } from "@/components/ui/icons";
import type { ContactInput } from "@/lib/validations/contact";
import type { ActionResult } from "@/app/(dashboard)/dashboard/crm/actions";
import { useActionState } from "react";

interface ContactFormProps {
  action: (prevState: ActionResult, formData: FormData) => Promise<ActionResult>;
  defaultValues?: Partial<ContactInput>;
  submitLabel: string;
  cancelHref: string;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Spinner size="sm" /> : <CheckIcon size={15} />}
      {label}
    </Button>
  );
}

const initialState: ActionResult = { success: true };

export function ContactForm({
  action,
  defaultValues,
  submitLabel,
  cancelHref,
}: ContactFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  const errors = state.success === false ? state.errors : {};

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {/* Identity */}
      <Card className="p-6">
        <h3 className="font-bold text-brand-black mb-4">Identité</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Prénom"
            name="firstName"
            required
            placeholder="Camille"
            defaultValue={defaultValues?.firstName ?? ""}
            error={errors.firstName?.[0]}
          />
          <Input
            label="Nom"
            name="lastName"
            required
            placeholder="Moreau"
            defaultValue={defaultValues?.lastName ?? ""}
            error={errors.lastName?.[0]}
          />
          <Input
            label="Email"
            type="email"
            name="email"
            required
            placeholder="c.moreau@entreprise.fr"
            defaultValue={defaultValues?.email ?? ""}
            error={errors.email?.[0]}
          />
          <Input
            label="Téléphone"
            name="phone"
            placeholder="06 12 34 56 78"
            hint="Optionnel"
            defaultValue={defaultValues?.phone ?? ""}
            error={errors.phone?.[0]}
          />
          <Input
            label="Fonction"
            name="title"
            placeholder="Office manager"
            hint="Optionnel"
            defaultValue={defaultValues?.title ?? ""}
            error={errors.title?.[0]}
          />
        </div>
      </Card>

      {/* Rattachement */}
      <Card className="p-6">
        <h3 className="font-bold text-brand-black mb-4">Rattachement</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Entreprise"
            name="company"
            placeholder="Acme SAS"
            hint="Optionnel"
            defaultValue={defaultValues?.company ?? ""}
            error={errors.company?.[0]}
          />
          <Select
            label="Statut"
            name="status"
            defaultValue={defaultValues?.status ?? "PROSPECT"}
            error={errors.status?.[0]}
          >
            <option value="PROSPECT">Prospect</option>
            <option value="CLIENT">Client</option>
            <option value="INACTIF">Inactif</option>
          </Select>
        </div>
      </Card>

      {/* Notes */}
      <Card className="p-6">
        <h3 className="font-bold text-brand-black mb-4">Notes internes</h3>
        <Textarea
          name="notes"
          rows={4}
          placeholder="Contexte, préférences, historique relationnel…"
          defaultValue={defaultValues?.notes ?? ""}
        />
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2">
        <Link href={cancelHref}>
          <Button type="button" variant="secondary">
            Annuler
          </Button>
        </Link>
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
