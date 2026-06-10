import { z } from "zod";

export const orderLineSchema = z.object({
  productId: z.string().min(1),
  quantity:  z.number().int().positive("La quantité doit être positive."),
  unitPrice: z.number().positive(),
});

export const orderSchema = z.object({
  contactId: z.string().min(1, "Le contact est requis."),
  notes:     z.string().optional(),
  lines:     z.array(orderLineSchema).min(1, "Au moins une ligne est requise."),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["DRAFT", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]),
});

export type OrderInput = z.infer<typeof orderSchema>;
export type OrderLineInput = z.infer<typeof orderLineSchema>;
