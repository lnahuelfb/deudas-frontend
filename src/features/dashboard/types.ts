import type { Debt } from "../debt/types"

export type DebtsData = {
  debts: Debt[],
  totalSubscriptions: Number,
  totalToPay: Number,
  totalToPayThisMonth: Number
}
