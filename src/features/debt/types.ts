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
  totalToPayThisMonth: number;
  isCreditCard: boolean;
}

export const debtSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  amountPerMonth: z.number().min(0, "El monto mensual debe ser positivo"),
  totalAmount: z.number().min(0, "El monto total debe ser positivo").optional(),
  isSubscription: z.boolean(),
  totalInstallments: z.number().min(1).optional(),
  currentInstallment: z.number().min(1).optional(),
  category: z.string().optional(),
});

export type Debt = z.infer<typeof debtSchema>;
