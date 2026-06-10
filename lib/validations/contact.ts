import { z } from "zod";

export const contactSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis."),
  lastName:  z.string().min(1, "Le nom est requis."),
  email:     z.string().email("Email invalide."),
  phone:     z.string().optional(),
  company:   z.string().optional(),
  title:     z.string().optional(),
  status:    z.enum(["CLIENT", "PROSPECT", "INACTIF"]).default("PROSPECT"),
  notes:     z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
