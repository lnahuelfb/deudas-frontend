import { XMarkIcon } from '@heroicons/react/24/outline';
import { useDebt } from '../hooks/useDebt';
import { DebtItemRow } from './DebItemRow';

export const CardDetailDrawer = ({ card, isOpen, onClose }: any) => {
  if (!isOpen || !card) return null;

  const { debts, loading, error } = useDebt(card.id) as unknown as { debts: any[], loading: boolean, error: string | null }

  return (
    <div className="fixed inset-0 z-100 flex justify-end">
      {/* Fondo oscuro con blur */}
      <div className="absolute inset-0 bg-[#4c1d95]/60 backdrop-blur-sm" onClick={onClose} />

      {/* Contenido que desliza */}
      <div className="relative w-full max-w-lg bg-[#4c1d95] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

        {/* Cabecera con el color de la tarjeta */}
        <div
          className="p-8 pb-12 rounded-b-[3.5rem] shadow-2xl relative overflow-hidden"
          style={{ backgroundColor: card.color }}
        >
          {/* Un pequeño gradiente para dar profundidad */}
          <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent pointer-events-none" />

          <div className="relative z-10">
            <button
              onClick={onClose}
              className="mb-8 p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-white" />
            </button>

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              {/* Izquierda: Info de la Cuenta */}
              <div className="space-y-1">
                <p className="text-white/60 text-xs font-black uppercase tracking-[0.2em]">
                  {card.brand || 'Cuenta Personal'}
                </p>
                <h2 className="text-white text-4xl font-black tracking-tight leading-none">
                  {card.name}
                </h2>
              </div>

              {/* Derecha: Monto Total */}
              <div className="text-left md:text-right border-t md:border-t-0 border-white/10 pt-6 md:pt-0">
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">
                  Total a pagar este mes
                </p>
                <p className="text-white text-4xl font-black tabular-nums tracking-tighter">
                  <span className="text-2xl mr-1 opacity-50 font-medium">$</span>
                  {card.totalToPayThisMonth?.toLocaleString('es-AR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de gastos */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <p className="text-violet-300 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Consumos de este mes</p>

          {/* Aquí iría el mapeo de los consumos reales */}
          {debts.map((debt, index) => (
            <DebtItemRow key={index} debt={debt} />
          ))}
        </div>

        {/* Botón para cargar un gasto NUEVO a esta tarjeta */}
        <div className="p-6 bg-white/5 backdrop-blur-md">
          <button className="w-full bg-white text-[#4c1d95] font-black p-5 rounded-4xl shadow-xl">
            + Cargar nuevo gasto
          </button>
        </div>
      </div>
    </div>
  );
};