import { CalendarIcon, CreditCardIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import type { CardWithSummary } from '../types';

interface DebtCardProps {
  card: CardWithSummary;
  onClick: () => void;
  loading: boolean;
}

export const DebtCard = ({ card, onClick, loading }: DebtCardProps) => {
  
  if (loading) {
    return (
      <div className="animate-pulse bg-white/5 rounded-[2.5rem] p-6 min-h-55">
        <div className="h-6 bg-white/10 rounded w-1/3 mb-4" />
        <div className="h-10 bg-white/10 rounded w-1/2 mb-6" />
        <div className="h-6 bg-white/10 rounded w-1/4 mb-2" />
        <div className="h-8 bg-white/10 rounded w-1/3" />
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="group relative w-full p-6 rounded-[2.5rem] shadow-xl text-white overflow-hidden cursor-pointer transition-all active:scale-[0.98] mb-4 hover:brightness-110 flex flex-col justify-between min-h-[220px]"
      style={{ backgroundColor: card.color }}
    >
      <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors duration-500" />

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">
            {card.brand || 'Deuda Personal'}
          </p>
          <h3 className="text-2xl font-black tracking-tight">{card.name}</h3>
        </div>
        {card.brand && (
          <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md border border-white/10">
            <CreditCardIcon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="relative z-10">

        <div className="h-10 flex items-center mb-1">
          {card.isCreditCard && card.closingDay ? (
            <div className="flex items-center gap-1.5 text-[10px] font-bold opacity-90 bg-black/10 w-fit px-3 py-1 rounded-full border border-white/5">
              <CalendarIcon className="w-3 h-3" />
              <span>Cierra el {card.closingDay}</span>
              <span className="mx-1 opacity-50">•</span>
              <span>Vence el {card.dueDay}</span>
            </div>
          ) : (
            <div className="h-6" />
          )}
        </div>

        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-[10px] opacity-70 uppercase font-black tracking-widest">Total este mes</p>
            <p className="text-3xl font-black leading-none">
              ${card.totalToPayThisMonth.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <span className="flex items-center gap-2 bg-white text-black font-bold px-5 py-2.5 rounded-2xl shadow-lg group-hover:shadow-white/20 transition-all text-xs">
            Ver detalle
            <ChevronRightIcon className="w-3 h-3 stroke-3" />
          </span>
        </div>
      </div>
    </div>
  );
};
