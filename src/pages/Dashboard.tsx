import { useGetAllDebts } from "@/features/debt/hooks/useDebt";
import { Charts } from "@/features/dashboard/components/charts";
import type { DebtsData } from "@/features/dashboard/types";

const Dashboard = () => {

  const { data, error } = useGetAllDebts() as { data: DebtsData | undefined; error: string | null }

  const defaultData: DebtsData = data || { debts: [], totalSubscriptions: 0, totalToPay: 0, totalToPayThisMonth: 0 }
  const debts = data?.debts || []

  console.log(defaultData)
  console.log("Debts", debts)

  return (
    <div className="min-h-screen p-6 bg-violet-950 text-white">
      <h1 className="text-2xl font-bold mb-4">Mis deudas</h1>

      {
        error && <h1>{error}</h1>
      }

      <Charts data={defaultData}/>

    </div>
  )
}

export default Dashboard