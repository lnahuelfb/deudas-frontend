import { ShoppingBagIcon, TvIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface DebtItemRowProps {
  debt: {
    title: string;
    amountPerMonth: number;
    totalAmount?: number;
    isSubscription: boolean;
    totalInstallments?: number;
    currentInstallment?: number;
    category?: string;
  };
}

export const DebtItemRow = ({ debt }: DebtItemRowProps) => {
  // Un pequeño mapeo de iconos según la categoría para que tu vieja identifique rápido
  const getIcon = () => {
    if (debt.isSubscription) return <TvIcon className="w-5 h-5 text-red-400" />;
    if (debt.category === 'Shopping') return <ShoppingBagIcon className="w-5 h-5 text-emerald-400" />;
    return <SparklesIcon className="w-5 h-5 text-violet-400" />;
  };

  return (
    <div className="flex items-center gap-4 p-5 bg-white/5 backdrop-blur-md rounded-4xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
      {/* Icono contenedor */}
      <div className="p-3 bg-white/10 rounded-2xl group-hover:scale-110 transition-transform">
        {getIcon()}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-white text-base truncate">{debt.title}</h4>
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider opacity-50 text-violet-200">
          {debt.isSubscription ? (
            <span>Suscripción</span>
          ) : (
            <span>Cuota {debt.currentInstallment} de {debt.totalInstallments}</span>
          )}
        </div>
      </div>

      <div className="text-right">
        <p className="text-lg font-black text-white leading-none mb-1">
          ${debt.amountPerMonth.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
        </p>
        {!debt.isSubscription && (
           <span className="text-[9px] font-black opacity-40 uppercase text-white">Quedan ${(debt.totalAmount! - (debt.amountPerMonth * (debt.currentInstallment! - 1))).toLocaleString('es-AR')}</span>
        )}
      </div>
    </div>
  );
};