import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import type { DebtsData } from '@features/dashboard/types';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export const Charts = ({ data }: { data: DebtsData }) => {
  const { debts, totalSubscriptions, totalToPay, totalToPayThisMonth } = data;

  const totalRemaining = Number(totalToPay) - Number(totalToPayThisMonth);
  const activeInstallmentsCount = debts.filter(d => !d.isSubscription && (d.totalInstallments ?? 0) > 1).length;

  const categoryMap = debts.reduce((acc: any, debt: any) => {
    const monthlyAmount = debt.amountPerMonth || (debt.totalAmount / debt.totalInstallments);
    acc[debt.category] = (acc[debt.category] || 0) + monthlyAmount;
    return acc;
  }, {});

  const categoryColors = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];

  const categoryChartData = {
    labels: Object.keys(categoryMap),
    datasets: [{
      data: Object.values(categoryMap),
      backgroundColor: categoryColors,
      hoverOffset: 15,
      borderWidth: 0,
    }],
  };

  const subVsOthersData = {
    labels: ['Suscripciones', 'Otros'],
    datasets: [{
      data: [totalSubscriptions, totalRemaining],
      backgroundColor: ['#8b5cf6', 'rgba(255, 255, 255, 0.05)'],
      borderWidth: 0,
      cutout: '85%',
    }],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, 
      tooltip: {
        backgroundColor: '#1e1b4b',
        padding: 12,
        cornerRadius: 12,
      }
    }
  };

  return (
    <div className="space-y-6 p-2">
      {/* SECCIÓN SUPERIOR: KPIS RÁPIDOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* CARD 1: ESTE MES */}
        <div className="bg-linear-to-br from-violet-600 to-indigo-700 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">A pagar este mes</p>
            <h3 className="text-white text-5xl font-black tracking-tighter">
              <span className="text-2xl opacity-50 mr-1">$</span>
              {totalToPayThisMonth.toLocaleString('es-AR')}
            </h3>
            <div className="mt-6 flex items-center gap-2">
              <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase">
                {activeInstallmentsCount} Compras en cuotas
              </span>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
        </div>

        {/* CARD 2: DEUDA TOTAL REMANENTE */}
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex flex-col justify-between">
          <div>
            <p className="text-violet-300 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Deuda total proyectada</p>
            <h3 className="text-white text-4xl font-black tracking-tighter">
              <span className="text-xl opacity-50 mr-1">$</span>
              {totalToPay.toLocaleString('es-AR')}
            </h3>
          </div>
          <div className="mt-4">
             <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase mb-2">
                <span>Progreso de pago</span>
                <span>{Math.round((Number(totalToPayThisMonth) / Number(totalToPay)) * 100)}%</span>
             </div>
             <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-violet-500 transition-all duration-1000" 
                  style={{ width: `${(Number(totalToPayThisMonth) / Number(totalToPay)) * 100}%` }} 
                />
             </div>
          </div>
        </div>

        {/* CARD 3: SUSCRIPCIONES (Visual Gauge) */}
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 flex items-center gap-6">
          <div className="w-24 h-24 relative shrink-0">
            <Doughnut data={subVsOthersData} options={commonOptions} />
            <div className="absolute inset-0 flex items-center justify-center flex-col">
               <span className="text-white text-xs font-black">{Math.round((Number(totalSubscriptions) / Number(totalToPayThisMonth)) * 100)}%</span>
            </div>
          </div>
          <div>
            <p className="text-violet-300 text-[10px] font-black uppercase tracking-[0.2em]">Suscripciones</p>
            <h4 className="text-white text-2xl font-black">${totalSubscriptions.toLocaleString('es-AR')}</h4>
            <p className="text-white/40 text-[9px] font-bold uppercase mt-1">Impacto en el presupuesto</p>
          </div>
        </div>
      </div>

      {/* SECCIÓN INFERIOR: CATEGORÍAS DETALLADAS */}
      <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 w-175" >
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2 h-75 relative">
            <Doughnut data={categoryChartData} options={commonOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-white/20 text-[10px] font-black uppercase">Categoría principal</span>
                <span className="text-white text-xl font-black uppercase tracking-tight">
                  {Object.keys(categoryMap).reduce((a, b) => categoryMap[a] > categoryMap[b] ? a : b, 'N/A')}
                </span>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 space-y-4">
            <p className="text-violet-300 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Desglose de consumos</p>
            {Object.entries(categoryMap).map(([label, value]: any, index) => (
              <div key={label} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: categoryColors[index % categoryColors.length] }} />
                  <span className="text-white/70 text-sm font-bold group-hover:text-white transition-colors">{label}</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-black text-sm">${value.toLocaleString('es-AR')}</span>
                  <span className="text-white/20 text-[10px] ml-2 font-bold">{Math.round((Number(value) / Number(totalToPayThisMonth)) * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};