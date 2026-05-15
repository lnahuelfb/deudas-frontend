import { useState, useMemo, useRef } from 'react';
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
import { getElementAtEvent } from 'react-chartjs-2';
import { ExclamationTriangleIcon, CheckBadgeIcon, SparklesIcon, CreditCardIcon } from '@heroicons/react/24/solid';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface Debt {
  id?: string;
  title: string;
  category?: string;
  totalAmount?: number;
  totalInstallments?: number;
  amountPerMonth: number;
  isSubscription: boolean;
  status?: string;
}

interface DebtsData {
  debts: Debt[];
  totalSubscriptions: number;
  totalToPay: number;
  totalToPayThisMonth: number;
}

interface ChartsProps {
  data: DebtsData;
  monthlyLimit?: number;
}

export const Charts = ({ data, monthlyLimit = 0 }: ChartsProps) => {
  const { debts, totalSubscriptions, totalToPay, totalToPayThisMonth } = data;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const chartRef = useRef<any>(null);

  // Aseguramos que los valores sean números primitivos para TS
  const nTotalToPayThisMonth = Number(totalToPayThisMonth || 0);
  const nTotalSubscriptions = Number(totalSubscriptions || 0);
  const nTotalToPay = Number(totalToPay || 0);
  const nMonthlyLimit = Number(monthlyLimit || 0);

  const categoryMap = useMemo(() => {
    return debts.reduce((acc: any, debt: any) => {
      const monthlyAmount = Number(debt.amountPerMonth || 0);
      const category = debt.category || 'Otros';
      acc[category] = (acc[category] || 0) + monthlyAmount;
      return acc;
    }, {});
  }, [debts]);

  const categoryColors = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];

  const categoryChartData = useMemo(() => ({
    labels: Object.keys(categoryMap),
    datasets: [{
      data: Object.values(categoryMap),
      backgroundColor: categoryColors,
      hoverOffset: 25,
      borderWidth: 0,
    }],
  }), [categoryMap]);

  const onChartClick = (event: any) => {
    const { current: chart } = chartRef;
    if (!chart) return;

    const element = getElementAtEvent(chart, event);
    if (element.length > 0) {
      const index = element[0].index;
      const label = categoryChartData.labels[index];
      setSelectedCategory(selectedCategory === label ? null : label);
    }
  };

  const otherMonthlyExpenses = Math.max(0, nTotalToPayThisMonth - nTotalSubscriptions);
  const subPercentage = nTotalToPayThisMonth > 0 ? Math.round((nTotalSubscriptions / nTotalToPayThisMonth) * 100) : 0;

  const subVsMonthlyData = useMemo(() => ({
    labels: ['Suscripciones', 'Otros Gastos'],
    datasets: [{
      data: [nTotalSubscriptions, otherMonthlyExpenses],
      backgroundColor: ['#8b5cf6', 'rgba(255, 255, 255, 0.05)'],
      borderWidth: 0,
      cutout: '80%',
    }],
  }), [nTotalSubscriptions, otherMonthlyExpenses]);

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 400 },
    plugins: {
      legend: { display: false }, 
      tooltip: {
        backgroundColor: '#1e1b4b',
        padding: 12,
        cornerRadius: 12,
      }
    }
  };

  const healthPercentage = nMonthlyLimit > 0 ? (nTotalToPayThisMonth / nMonthlyLimit) * 100 : 0;
  const isOverLimit = healthPercentage > 100;
  const isCloseToLimit = healthPercentage > 80 && !isOverLimit;

  return (
    <div className="space-y-6">
      
      {/* SECCIÓN DE SALUD FINANCIERA */}
      {nMonthlyLimit > 0 ? (
        <div className={`p-8 rounded-[3rem] border transition-all duration-500 ${
          isOverLimit ? 'bg-red-500/10 border-red-500/50' : 
          isCloseToLimit ? 'bg-amber-500/10 border-amber-500/50' : 
          'bg-emerald-500/10 border-emerald-500/50'
        }`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {isOverLimit ? <ExclamationTriangleIcon className="w-6 h-6 text-red-500" /> : 
                 isCloseToLimit ? <ExclamationTriangleIcon className="w-6 h-6 text-amber-500" /> :
                 <CheckBadgeIcon className="w-6 h-6 text-emerald-500" />}
                <h3 className="text-white text-2xl font-black italic">
                  {isOverLimit ? '¡Presupuesto excedido!' : 
                   isCloseToLimit ? 'Cuidado con los gastos' :
                   'Presupuesto saludable'}
                </h3>
              </div>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
                Uso del presupuesto: ${nTotalToPayThisMonth.toLocaleString()} de ${nMonthlyLimit.toLocaleString()}
              </p>
            </div>
            <div className="w-full md:w-64 space-y-2">
               <div className="flex justify-between text-[10px] font-black text-white/60 uppercase">
                  <span>Progreso</span>
                  <span className={isOverLimit ? 'text-red-400' : 'text-white'}>{Math.round(healthPercentage)}%</span>
               </div>
               <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      isOverLimit ? 'bg-red-500' : isCloseToLimit ? 'bg-amber-500' : 'bg-emerald-500'
                    }`} 
                    style={{ width: `${Math.min(healthPercentage, 100)}%` }}
                  />
               </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-[3rem] bg-white/5 border border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-white/60 font-bold italic text-center md:text-left">
             Aún no has configurado un límite mensual.
           </p>
           <a href="/settings" className="bg-white text-[#1e1b4b] px-8 py-4 rounded-3xl font-black uppercase text-xs shadow-xl hover:scale-105 transition-transform">
             Configurar límite
           </a>
        </div>
      )}

      {/* KPIS RÁPIDOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-linear-to-br from-violet-600 to-indigo-700 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Total a pagar este mes</p>
            <h3 className="text-white text-5xl font-black tracking-tighter">
              <span className="text-2xl opacity-50 mr-1">$</span>
              {nTotalToPayThisMonth.toLocaleString('es-AR')}
            </h3>
            <div className="mt-6">
               <span className="bg-white/20 px-3 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                 {debts.filter(d => !d.isSubscription && d.status !== 'PAID').length} consumos activos
               </span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 flex items-center gap-6 group hover:bg-white/[0.08] transition-all">
          <div className="w-24 h-24 relative shrink-0">
            <Doughnut data={subVsMonthlyData} options={commonOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <span className="text-white text-lg font-black">{subPercentage}%</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
               <SparklesIcon className="w-4 h-4 text-violet-400" />
               <p className="text-violet-300 text-[10px] font-black uppercase tracking-[0.2em]">Suscripciones</p>
            </div>
            <h4 className="text-white text-2xl font-black">${nTotalSubscriptions.toLocaleString('es-AR')}</h4>
            <p className="text-white/30 text-[10px] font-bold uppercase mt-1">del gasto mensual</p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-4 right-4 text-white/10 group-hover:text-violet-500/20 transition-colors">
             <CreditCardIcon className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
               <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Capital Pendiente (Cuotas)</p>
            </div>
            <h3 className="text-white text-3xl font-black tracking-tighter">
              <span className="text-xl opacity-50 mr-1">$</span>
              {nTotalToPay.toLocaleString('es-AR')}
            </h3>
            <p className="text-violet-400/50 text-[9px] font-bold uppercase mt-1 tracking-wider italic">
              * No incluye suscripciones recurrentes
            </p>
          </div>
          <div className="mt-4">
             <div className="flex justify-between text-[9px] font-black text-white/20 uppercase mb-2">
                <span>Progreso de amortización</span>
                <span>{nTotalToPay > 0 ? Math.round(((nTotalToPayThisMonth - nTotalSubscriptions) / nTotalToPay) * 100) : 0}%</span>
             </div>
             <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500/50 transition-all duration-1000" 
                  style={{ width: `${nTotalToPay > 0 ? Math.min(((nTotalToPayThisMonth - nTotalSubscriptions) / nTotalToPay) * 100, 100) : 0}%` }} 
                />
             </div>
          </div>
        </div>
      </div>

      {/* CATEGORÍAS */}
      <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8" >
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2 h-75 relative">
            <Doughnut 
              ref={chartRef} 
              data={categoryChartData} 
              options={commonOptions} 
              onClick={onChartClick}
              className="cursor-pointer"
            />
          </div>
          
          <div className="w-full md:w-1/2 space-y-4">
            <p className="text-violet-300 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              {selectedCategory ? `Consumos en ${selectedCategory}` : 'Desglose por categorías'}
            </p>
            
            <div className="max-h-64 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {(selectedCategory 
                ? debts.filter((d: any) => d.category === selectedCategory)
                : Object.entries(categoryMap).map(([label, value]) => ({ label, value }))
              ).map((item: any, index: number) => {
                const isDebt = !!item.title;
                const label = isDebt ? item.title : item.label;
                const value = Number(isDebt ? item.amountPerMonth : item.value);

                return (
                  <div key={label} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all">
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: categoryColors[index % categoryColors.length] }} />
                       <span className="text-white/70 text-sm font-bold">{label}</span>
                    </div>
                    <span className="text-white font-black text-sm">${value.toLocaleString('es-AR')}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};