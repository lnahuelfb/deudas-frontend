export type Card = {
  id: string
  name: string
  brand: "visa" | "mastercard"
  closingDate: number
  dueDate: number
}