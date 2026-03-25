import { z } from 'zod';

export const cardSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  brand: z.string().min(1, "La marca es requerida"),
  color: z.string().min(1, "El color es requerido"),
  isCreditCard: z.boolean(),
  closingDay: z.number().int().min(1).max(31).optional(),
  dueDay: z.number().int().min(1).max(31).optional()
})

export type Card = z.infer<typeof cardSchema>;

export const cardWithSummarySchema = cardSchema.extend({
  monthlyTotal: z.number(),
  remainingLimit: z.number().optional()
});

export type CardWithSummary = z.infer<typeof cardWithSummarySchema>;

export type CreateCardInput = Omit<Card, 'id'>;