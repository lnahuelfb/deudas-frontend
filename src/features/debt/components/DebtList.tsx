import { DebtCard } from "./DebtCard"

const debts = [
  { id: 1, name: "Motel Pago", amount: 5000, status: "pending" },
  { id: 2, name: "Tarjeta de crédito", amount: 12000, status: "paid" },
  { id: 3, name: "Compra online", amount: 3500, status: "pending" }
]

const DebtList = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {debts.map((debt) => (
        <DebtCard key={debt.id} debt={debt} />
      ))}
    </div>
  )
}

export default DebtList