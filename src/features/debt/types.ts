import { z } from 'zod';

export const cardSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().min(1, "El nombre es obligatorio"),
  brand: z.enum(["Visa", "Mastercard", "American Express", "Naranja", "Personal", "Otra"]).optional(),
  color: z.string().min(1, "El color es obligatorio"),
  closingDay: z.number().min(1).max(31).optional(),
  dueDay: z.number().min(1).max(31).optional(),
});

export type Card = z.infer<typeof cardSchema>;

export interface CardWithSummary extends Card {
  monthlyTotal: number;
  isCreditCard: boolean;
}
