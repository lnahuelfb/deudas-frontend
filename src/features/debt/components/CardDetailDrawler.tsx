import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useDebt, useDeleteDebt } from '../hooks/useDebt';
import { DebtItemRow } from './DebItemRow';
import { AddDebtModal } from './AddDebtModal';
import type { Debt } from '../types';

const DrawerContainer = ({ children, card, onClose, onAddClick }: any) => (
  <div className="fixed inset-0 z-100 flex justify-end">
    <div className="absolute inset-0 bg-[#4c1d95]/60 backdrop-blur-sm" onClick={onClose} />
    <div className="relative w-full max-w-lg bg-[#4c1d95] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

      <div
        className="p-8 pb-12 rounded-b-[3.5rem] shadow-2xl relative overflow-hidden"
        style={{ backgroundColor: card.color }}
      >
        <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <button onClick={onClose} className="mb-8 p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors">
            <XMarkIcon className="w-6 h-6 text-white" />
          </button>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-1">
              <p className="text-white/60 text-xs font-black uppercase tracking-[0.2em]">{card.brand || 'Cuenta Personal'}</p>
              <h2 className="text-white text-4xl font-black tracking-tight leading-none">{card.name}</h2>
            </div>
            {card.totalToPayThisMonth !== undefined && (
              <div className="text-left md:text-right border-t md:border-t-0 border-white/10 pt-6 md:pt-0">
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">Total a pagar este mes</p>
                <p className="text-white text-4xl font-black tabular-nums tracking-tighter">
                  <span className="text-2xl mr-1 opacity-50 font-medium">$</span>
                  {card.totalToPayThisMonth.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {children}
      </div>


      <div className="p-6 bg-white/5 backdrop-blur-md">
        <button
          onClick={onAddClick}
          className="w-full bg-white text-[#4c1d95] font-black p-5 rounded-4xl shadow-xl hover:scale-[1.02] active:scale-95 transition-transform"
        >
          + Cargar nuevo gasto
        </button>
      </div>
    </div>
  </div>
);

export const CardDetailDrawer = ({ card, isOpen, onClose, onAccountUpdate }: any) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { deleteDebt } = useDeleteDebt();

  const handleDelete = async (debt: Debt) => {
    if (!debt.id) {
      alert("Error: Deuda sin ID");
      return;
    }

    if (window.confirm(`¿Seguro querés borrar "${debt.title}"?`)) {
      try {
        await deleteDebt(debt.id);

        fetchUserDebts();

        if (onAccountUpdate) {
          onAccountUpdate();
        }

      } catch (err: any) {

        alert("Error al eliminar: " + err.message);
      }
    }
  };

  const { debts, loading, error, fetchUserDebts } = useDebt(card?.id);

  if (!isOpen || !card) return null;

  return (
    <>
      <DrawerContainer
        card={card}
        onClose={onClose}
        onAddClick={() => setIsAddModalOpen(true)}
      >
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-20 bg-white/5 rounded-3xl animate-pulse" />)}
          </div>
        ) : error ? (
          <p className="text-red-300">{error}</p>
        ) : (
          <>
            <p className="text-violet-300 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Consumos de este mes</p>
            {debts.map((debt: Debt) => (
              <DebtItemRow key={debt.id} debt={debt} onDelete={() => handleDelete(debt)} />
            ))}
          </>
        )}
      </DrawerContainer>

      <AddDebtModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        card={card}
        onSuccess={async () => {
          await fetchUserDebts();

          if (onAccountUpdate) {
            await onAccountUpdate();
          }
          setIsAddModalOpen(false);
        }}
      />
    </>
  );
};