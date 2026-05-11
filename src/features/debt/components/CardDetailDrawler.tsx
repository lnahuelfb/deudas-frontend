import { useState, useMemo } from 'react';
import { XMarkIcon, CheckCircleIcon, SparklesIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useDebt, useDeleteDebt } from '../hooks/useDebt';
import { usePayCard } from '../hooks/useCards';
import { DebtItemRow } from './DebItemRow';
import { AddDebtModal } from './AddDebtModal';
import { ConfirmModal } from '@/ui/ConfirmModal';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import type { Debt } from '../types';

const DrawerContainer = ({ children, card, onClose, onAddClick, onPayClick, isPaying, searchTerm, setSearchTerm }: any) => (
  <div className="fixed inset-0 z-100 flex justify-end overflow-hidden">
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-[#1e1b4b]/80" 
      onClick={onClose} 
    />
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'tween', ease: 'easeOut', duration: 0.25 }}
      className="relative w-full max-w-lg bg-[#4c1d95] h-full shadow-2xl flex flex-col z-10"
    >

      {/* HEADER */}
      <div
        className="p-8 pb-10 rounded-b-[3.5rem] shadow-2xl relative overflow-hidden shrink-0"
        style={{ backgroundColor: card.color }}
      >
        <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors">
              <XMarkIcon className="w-6 h-6 text-white" />
            </button>
            
            {/* Buscador Integrado en Header */}
            <div className="relative flex-1 ml-4 group">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" />
              <input 
                type="text"
                placeholder="Buscar gasto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 border border-white/5 p-2.5 pl-10 rounded-2xl text-white text-sm outline-none focus:bg-white/20 focus:ring-1 focus:ring-white/20 transition-all placeholder:text-white/30"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-white/60 text-xs font-black uppercase tracking-[0.2em]">{card.brand || 'Cuenta Personal'}</p>
            <h2 className="text-white text-4xl font-black tracking-tight leading-none mb-4">{card.name}</h2>
            
            <div className="pt-4 border-t border-white/10">
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">Saldo del mes</p>
              <p className="text-white text-5xl font-black tabular-nums tracking-tighter">
                <span className="text-2xl mr-1 opacity-50 font-medium">$</span>
                {card.totalToPayThisMonth.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {children}
        </AnimatePresence>
      </div>

      {/* FOOTER */}
      <div className="p-6 bg-[#4c1d95] border-t border-white/5 space-y-3 shrink-0">
        <AnimatePresence>
          {card.totalToPayThisMonth > 0 && (
            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={onPayClick}
              disabled={isPaying}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black p-5 rounded-3xl shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
            >
              <CheckCircleIcon className="w-6 h-6" />
              <span className="text-sm uppercase tracking-wider">
                {isPaying ? 'Procesando...' : `Marcar como pagado ($${card.totalToPayThisMonth.toLocaleString('es-AR')})`}
              </span>
            </motion.button>
          )}
        </AnimatePresence>

        <button
          onClick={onAddClick}
          className="w-full bg-white/10 hover:bg-white/15 text-white font-bold p-5 rounded-3xl flex items-center justify-center gap-2 transition-all active:scale-95 border border-white/5"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Cargar nuevo gasto</span>
        </button>
      </div>
    </motion.div>
  </div>
);

export const CardDetailDrawer = ({ card, isOpen, onClose, onAccountUpdate }: any) => {
  if (!card) return null;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [debtToEdit, setDebtToEdit] = useState<Debt | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant: 'danger' | 'primary';
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
    variant: 'primary'
  });

  const { deleteDebt } = useDeleteDebt();
  const { doPayCard, loading: isPaying } = usePayCard();
  const { debts, loading, error, fetchUserDebts } = useDebt(card?.id);

  // Filtrado de deudas en tiempo real
  const filteredDebts = useMemo(() => {
    if (!searchTerm) return debts;
    return debts.filter(debt => 
      debt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      debt.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [debts, searchTerm]);

  const handleDeleteClick = (debt: Debt) => {
    if (!debt.id) return;
    setConfirmConfig({
      isOpen: true,
      title: '¿Eliminar gasto?',
      description: `Estás por borrar "${debt.title}". Esta acción no se puede deshacer.`,
      variant: 'danger',
      onConfirm: () => executeDelete(debt.id!)
    });
  };

  const executeDelete = async (id: string) => {
    try {
      await deleteDebt(id);
      toast.success("Deuda eliminada correctamente");
      fetchUserDebts();
      if (onAccountUpdate) await onAccountUpdate();
    } catch (err: any) {
      toast.error("Error al eliminar: " + err.message);
    }
  };

  const handlePayClick = () => {
    setConfirmConfig({
      isOpen: true,
      title: '¿Confirmar pago?',
      description: `Se registrará el pago de la tarjeta "${card.name}" para este mes y se actualizarán tus consumos.`,
      variant: 'primary',
      onConfirm: executePay
    });
  };

  const executePay = async () => {
    try {
      await doPayCard(card.id);
      toast.success(`¡Tarjeta ${card.name} pagada!`);
      await fetchUserDebts();
      if (onAccountUpdate) await onAccountUpdate();
    } catch (err: any) {
      toast.error("Error al procesar el pago: " + err.message);
    }
  };

  const handleEditClick = (debt: Debt) => {
    setDebtToEdit(debt);
    setIsAddModalOpen(true);
  };

  const handleAddClick = () => {
    setDebtToEdit(null);
    setIsAddModalOpen(true);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && card && (
          <DrawerContainer
            card={card}
            onClose={onClose}
            onAddClick={handleAddClick}
            onPayClick={handlePayClick}
            isPaying={isPaying}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          >
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-white/5 rounded-4xl flex items-center px-6 gap-4 animate-pulse">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl" />
                    <div className="flex-1 space-y-2">
                      <div className="w-24 h-3 bg-white/10 rounded-full" />
                      <div className="w-16 h-2 bg-white/5 rounded-full" />
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : error ? (
              <p className="text-red-300">{error}</p>
            ) : filteredDebts.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-4">
                <div className="p-6 bg-white/5 rounded-full">
                  <SparklesIcon className="w-12 h-12 text-violet-300/50" />
                </div>
                <div>
                  <p className="text-white font-black text-lg">
                    {searchTerm ? 'Sin resultados' : '¡Todo al día!'}
                  </p>
                  <p className="text-violet-200/50 text-sm font-semibold">
                    {searchTerm 
                      ? `No encontramos coincidencias para "${searchTerm}"`
                      : 'No tenés consumos registrados para esta tarjeta este mes.'
                    }
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <p className="text-violet-300 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                  {searchTerm ? `Resultados para "${searchTerm}"` : 'Consumos de este mes'}
                </p>
                {filteredDebts.map((debt: Debt, index: number) => (
                  <motion.div key={debt.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.02, duration: 0.15 }}>
                    <DebtItemRow 
                      debt={debt} 
                      onDelete={() => handleDeleteClick(debt)} 
                      onEdit={() => handleEditClick(debt)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </DrawerContainer>
        )}
      </AnimatePresence>

      <AddDebtModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        card={card}
        debtToEdit={debtToEdit}
        onSuccess={async () => {
          await fetchUserDebts();
          if (onAccountUpdate) await onAccountUpdate();
          setIsAddModalOpen(false);
        }}
      />

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        description={confirmConfig.description}
        variant={confirmConfig.variant}
        onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.onConfirm}
      />
    </>
  );
};