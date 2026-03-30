// EditDebtModal.tsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { DebtFormFields } from './DebtFormFields';
import { useUpdateDebt } from '../hooks/useDebt';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';

export const EditDebtModal = ({ isOpen, onClose, debtToEdit, onSuccess }: any) => {
  const { updateDebt, loading } = useUpdateDebt();
  
  // Importante: Sacamos todo lo necesario de useForm
  const { register, handleSubmit, watch, reset, setValue } = useForm();

  // Cargamos los datos cuando el modal se abre con una deuda
  useEffect(() => {
    if (debtToEdit && isOpen) {
      reset({
        title: debtToEdit.title,
        category: debtToEdit.category || 'Varios',
        totalAmount: debtToEdit.totalAmount.toString(),
        totalInstallments: debtToEdit.totalInstallments,
        initialPaidInstallments: debtToEdit.paidInstallments, // Ojo con el nombre en tu DB
        isSubscription: debtToEdit.isSubscription,
        amountPerMonth: debtToEdit.amountPerMonth.toString()
      });
    }
  }, [debtToEdit, isOpen, reset]);

  const onSubmit = async (data: any) => {
    try {
      await updateDebt(debtToEdit.id, {
        ...data,
        totalAmount: parseFloat(data.totalAmount),
        amountPerMonth: parseFloat(data.amountPerMonth),
        totalInstallments: parseInt(data.totalInstallments),
        initialPaidInstallments: parseInt(data.initialPaidInstallments),
      });
      onSuccess(); 
    } catch (e) {
      console.error("Error al editar la deuda", e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-130 flex items-center justify-center p-4 bg-[#2e1065]/80 backdrop-blur-xl">
      <div className="bg-[#1e1b4b] w-full max-w-2xl overflow-hidden rounded-[3.5rem] shadow-2xl flex flex-col border border-white/10 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-8 pb-4 flex justify-between items-center">
          <div>
            <h3 className="text-white text-3xl font-black italic tracking-tight">Editar Gasto</h3>
            <p className="text-violet-300/60 text-xs font-bold uppercase tracking-widest">Modificá los detalles del consumo</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8 pt-4">
          <DebtFormFields 
            register={register} 
            watch={watch} 
            setValue={setValue} 
          />
        </div>

        {/* Footer */}
        <div className="p-8 bg-white/5 border-t border-white/5 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 p-5 rounded-3xl text-white/40 font-black uppercase text-xs hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            className="flex-2 bg-white disabled:bg-white/10 disabled:text-white/20 text-[#1e1b4b] p-5 rounded-4xl font-black uppercase text-xs shadow-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
          >
            {loading ? (
              "Guardando..."
            ) : (
              <><CheckIcon className="w-5 h-5 stroke-[3px]" /> Guardar Cambios</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};