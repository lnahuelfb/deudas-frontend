import { Charts } from '@/features/dashboard/components/charts';
import { useGetAllDebts } from '@/features/debt/hooks/useDebt';
import { useSession } from '@/features/auth/hooks/useSession';
import { ChartSkeleton } from '@/ui/Skeleton';

export default function Dashboard() {
  const { data: debtsData, loading: isLoadingDebts } = useGetAllDebts();
  const { data: session } = useSession();

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4">
      {/* Header del Dashboard */}
      <header className="pt-8">
        <h1 className="text-4xl font-black italic text-white tracking-tight">Dashboard</h1>
        <p className="text-violet-300/60 font-bold uppercase text-[10px] tracking-[0.3em]">Resumen general de tu salud financiera</p>
      </header>

      {/* Resumen y Gráficos */}
      <section>
        {isLoadingDebts ? (
          <ChartSkeleton />
        ) : (
          <Charts 
            data={debtsData || { debts: [], totalToPayThisMonth: 0, totalToPay: 0, totalSubscriptions: 0 }}
            monthlyLimit={session?.monthlySpendingLimit || 0}
          />
        )}
      </section>

      {/* Acceso Rápido a Gestión */}
      <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-white text-xl font-black italic">¿Necesitás gestionar tus consumos?</h3>
          <p className="text-violet-200/50 text-sm font-semibold">Entrá a la sección de deudas para ver el detalle por tarjeta.</p>
        </div>
        <a 
          href="/debts" 
          className="bg-white text-[#1e1b4b] px-8 py-4 rounded-3xl font-black uppercase text-xs shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          Ir a mis deudas
        </a>
      </div>
    </div>
  );
}