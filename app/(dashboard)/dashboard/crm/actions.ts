"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations/contact";
import type { ContactStatus } from "@/app/generated/prisma/client";

export type ActionResult =
  | { success: true }
  | { success: false; errors: Record<string, string[]> };

export async function createContact(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const raw = {
    firstName: formData.get("firstName"),
    lastName:  formData.get("lastName"),
    email:     formData.get("email"),
    phone:     formData.get("phone") || undefined,
    company:   formData.get("company") || undefined,
    title:     formData.get("title") || undefined,
    status:    formData.get("status") || "PROSPECT",
    notes:     formData.get("notes") || undefined,
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const contact = await prisma.contact.create({
    data: {
      firstName: parsed.data.firstName,
      lastName:  parsed.data.lastName,
      email:     parsed.data.email,
      phone:     parsed.data.phone ?? null,
      company:   parsed.data.company ?? null,
      title:     parsed.data.title ?? null,
      status:    parsed.data.status as ContactStatus,
      notes:     parsed.data.notes ?? null,
    },
  });

  revalidatePath("/dashboard/crm");
  redirect(`/dashboard/crm/${contact.id}`);
}

export async function updateContact(
  id: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    firstName: formData.get("firstName"),
    lastName:  formData.get("lastName"),
    email:     formData.get("email"),
    phone:     formData.get("phone") || undefined,
    company:   formData.get("company") || undefined,
    title:     formData.get("title") || undefined,
    status:    formData.get("status") || "PROSPECT",
    notes:     formData.get("notes") || undefined,
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  await prisma.contact.update({
    where: { id },
    data: {
      firstName: parsed.data.firstName,
      lastName:  parsed.data.lastName,
      email:     parsed.data.email,
      phone:     parsed.data.phone ?? null,
      company:   parsed.data.company ?? null,
      title:     parsed.data.title ?? null,
      status:    parsed.data.status as ContactStatus,
      notes:     parsed.data.notes ?? null,
    },
  });

  revalidatePath("/dashboard/crm");
  revalidatePath(`/dashboard/crm/${id}`);
  redirect(`/dashboard/crm/${id}`);
}

export async function deleteContact(id: string): Promise<void> {
  await prisma.contact.delete({ where: { id } });
  revalidatePath("/dashboard/crm");
  redirect("/dashboard/crm");
}
