import { DebtsList } from "@/features/dashboard/components/DebtList";
import { DebtsSummary } from "@/features/dashboard/components/DebtSummary";

const Dashboard = () => {
  const debts = [
    { id: 1, name: "Juan Pérez", amount: 5000, dueDate: "2024-07-15", paid: false, category: "Personal" },
    { id: 2, name: "María Gómez", amount: 3000, dueDate: "2024-08-01", paid: true, category: "Comida" },
    { id: 3, name: "Carlos López", amount: 2000, dueDate: "2024-09-10", paid: false, category: "Ropa" }
  ];

  return (
    <div className="min-h-screen p-6 bg-violet-950 text-white">
      <h1 className="text-2xl font-bold mb-4">Mis deudas</h1>

      <DebtsSummary debts={debts} />

      <DebtsList debts={debts} />
    </div>
  )
}

export default Dashboard