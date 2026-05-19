import { z } from 'zod';

export const DEBT_CATEGORIES = [
  "Ropa",
  "Supermercado",
  "Tecnología",
  "Suscripción",
  "Hogar",
  "Salud",
  "Transporte",
  "Restaurantes",
  "Educación",
  "Ocio",
  "Varios"
] as const;

export const cardSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().min(1, "El nombre es obligatorio"),
  brand: z.enum(["Visa", "Mastercard", "American Express", "Naranja", "Mercado Pago", "Personal", "Otra"]).optional().nullable(),
  color: z.string().min(1, "El color es obligatorio"),
  closingDay: z.number().min(1).max(31).optional().nullable(),
  dueDay: z.number().min(1).max(31).optional().nullable(),
  type: z.enum(["CREDIT_CARD", "PERSONAL", "BANK"]).default("CREDIT_CARD"),
});

export type Card = z.infer<typeof cardSchema>;

export interface CardWithSummary extends Card {
  totalToPayThisMonth: number;
  pendingDebtsCount: number;
  isCreditCard?: boolean;
}

export const debtSchema = z.object({
  id: z.string().cuid().optional(),
  title: z.string().min(1, "El título es obligatorio"),
  amountPerMonth: z.coerce.number().min(0, "El monto mensual debe ser positivo"),
  totalAmount: z.coerce.number().min(0, "El monto total debe ser positivo").optional(),
  isSubscription: z.boolean(),
  startDate: z.string().optional(),
  totalInstallments: z.coerce.number().min(1, "El total de cuotas debe ser al menos 1").optional(),
  currentInstallment: z.coerce.number().min(1).optional(),
  category: z.string().optional(),
  accountId: z.string().min(1),
  initialPaidInstallments: z.coerce.number().min(0, "Las cuotas pagadas no pueden ser negativas").default(0),
}).refine((data) => {
  if (data.isSubscription) return true;
  const total = data.totalInstallments || 1;
  const paid = data.initialPaidInstallments || 0;
  return paid <= total;
}, {
  message: "Las cuotas pagadas no pueden ser mayores al total de cuotas",
  path: ["initialPaidInstallments"]
});

export type Debt = z.infer<typeof debtSchema>;
