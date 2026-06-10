"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { orderSchema, updateOrderStatusSchema } from "@/lib/validations/order";
import type { OrderStatus } from "@/app/generated/prisma/client";
import { ORDER_FLOW } from "@/components/ui/StatusPill";

export async function createOrder(data: {
  contactId: string;
  notes: string;
  lines: { productId: string; quantity: number; unitPrice: number }[];
  status?: OrderStatus;
}) {
  const parsed = orderSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const { contactId, notes, lines } = parsed.data;

  const total = +lines
    .reduce(
      (sum: number, l: { quantity: number; unitPrice: number }) =>
        sum + l.quantity * l.unitPrice,
      0
    )
    .toFixed(2);

  const count = await prisma.order.count();
  const seq = count + 1;
  const reference = `CMD-${new Date().getFullYear()}-${String(seq).padStart(4, "0")}`;

  const initialStatus: OrderStatus =
    data.status === "CONFIRMED" ? "CONFIRMED" : "DRAFT";

  const order = await prisma.order.create({
    data: {
      reference,
      status: initialStatus,
      contactId,
      notes: notes ?? null,
      total,
      lines: {
        create: lines.map(
          (l: { productId: string; quantity: number; unitPrice: number }) => ({
            productId: l.productId,
            quantity: l.quantity,
            unitPrice: l.unitPrice,
            total: +(l.quantity * l.unitPrice).toFixed(2),
          })
        ),
      },
    },
  });

  revalidatePath("/dashboard/orders");
  redirect(`/dashboard/orders/${order.id}`);
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const parsed = updateOrderStatusSchema.safeParse({ status });
  if (!parsed.success) {
    throw new Error("Statut invalide.");
  }

  const order = await prisma.order.findUniqueOrThrow({ where: { id } });

  if (status === "CANCELLED") {
    if (order.status !== "DRAFT" && order.status !== "CONFIRMED") {
      throw new Error(
        "Seules les commandes en brouillon ou confirmées peuvent être annulées."
      );
    }
  } else {
    const curIdx = ORDER_FLOW.indexOf(order.status);
    const nextIdx = ORDER_FLOW.indexOf(status);
    if (nextIdx !== curIdx + 1) {
      throw new Error(
        `Transition de statut invalide : ${order.status} → ${status}`
      );
    }
  }

  await prisma.order.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/dashboard/orders");
  revalidatePath(`/dashboard/orders/${id}`);
  redirect(`/dashboard/orders/${id}`);
}

export async function deleteOrder(id: string) {
  const order = await prisma.order.findUniqueOrThrow({ where: { id } });

  if (order.status !== "DRAFT") {
    throw new Error(
      "Seules les commandes en brouillon peuvent être supprimées."
    );
  }

  await prisma.order.delete({ where: { id } });

  revalidatePath("/dashboard/orders");
  redirect("/dashboard/orders");
}
