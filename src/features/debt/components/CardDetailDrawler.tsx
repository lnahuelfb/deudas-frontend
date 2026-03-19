// src/features/debts/components/CardDetailDrawer.tsx
import { XMarkIcon } from '@heroicons/react/24/outline';
import { DebtItemRow } from './DebItemRow';

export const CardDetailDrawer = ({ card, isOpen, onClose }: any) => {
  if (!isOpen || !card) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Fondo oscuro con blur */}
      <div className="absolute inset-0 bg-[#4c1d95]/60 backdrop-blur-sm" onClick={onClose} />

      {/* Contenido que desliza */}
      <div className="relative w-full max-w-lg bg-[#4c1d95] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Cabecera con el color de la tarjeta */}
        <div 
          className="p-8 pb-10 rounded-b-[3.5rem] shadow-2xl" 
          style={{ backgroundColor: card.color }}
        >
          <button onClick={onClose} className="mb-6 p-2 bg-white/20 rounded-xl">
            <XMarkIcon className="w-6 h-6 text-white" />
          </button>
          <h2 className="text-white text-3xl font-black">{card.name}</h2>
          <p className="text-white/70 text-xs font-bold uppercase tracking-widest">{card.brand}</p>
        </div>

        {/* Lista de gastos */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <p className="text-violet-300 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Consumos de este mes</p>
          
          {/* Aquí iría el mapeo de los consumos reales */}
          <DebtItemRow debt={{ title: "Netflix", amountPerMonth: 8500, isSubscription: true }} />
          <DebtItemRow debt={{ title: "Zapatillas", amountPerMonth: 15000, totalInstallments: 6, currentInstallment: 2, isSubscription: false }} />
        </div>

        {/* Botón para cargar un gasto NUEVO a esta tarjeta */}
        <div className="p-6 bg-white/5 backdrop-blur-md">
           <button className="w-full bg-white text-[#4c1d95] font-black p-5 rounded-[2rem] shadow-xl">
             + Cargar nuevo gasto
           </button>
        </div>
      </div>
    </div>
  );
};