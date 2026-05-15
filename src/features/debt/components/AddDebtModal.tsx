import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { debtSchema } from '../types';
import { useAddDebt, useUpdateDebt } from '../hooks/useDebt';
import { XMarkIcon, PlusIcon, TrashIcon, CheckIcon, PencilIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

export const AddDebtModal = ({ isOpen, onClose, card, onSuccess, debtToEdit = null }: any) => {
  const { addDebt, loading: adding } = useAddDebt();
  const { updateDebt, loading: updating } = useUpdateDebt();
  const [tempDebts, setTempDebts] = useState<any[]>([]);

  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(debtSchema),
    defaultValues: {
      title: '',
      category: 'Varios',
      totalAmount: 0 as any,
      totalInstallments: 1,
      initialPaidInstallments: 0,
      isSubscription: false,
      amountPerMonth: 0 as any,
      accountId: card?.id || '',
    }
  });

  const [editingTempId, setEditingTempId] = useState<number | null>(null);

  // Cargar datos si estamos editando una deuda real (desde la DB)
  useEffect(() => {
    if (debtToEdit && isOpen) {
      setValue('title', debtToEdit.title);
      setValue('category', debtToEdit.category);
      setValue('totalAmount', debtToEdit.totalAmount?.toString() || '');
      setValue('totalInstallments', debtToEdit.totalInstallments || 1);
      setValue('initialPaidInstallments', debtToEdit.initialPaidInstallments || 0);
      setValue('isSubscription', debtToEdit.isSubscription);
      setValue('amountPerMonth', debtToEdit.amountPerMonth?.toString() || '');
    } else if (!debtToEdit && isOpen) {
      reset();
    }
  }, [debtToEdit, isOpen, setValue, reset]);

  const addToTempList = (data: any) => {
    if (editingTempId) {
      setTempDebts(tempDebts.map(d => d.id === editingTempId ? { ...data, id: editingTempId } : d));
      setEditingTempId(null);
    } else {
      setTempDebts([...tempDebts, { ...data, id: Date.now() }]);
    }
    reset();
  };

  const handleEditTemp = (debt: any) => {
    setEditingTempId(debt.id);
    setValue('title', debt.title);
    setValue('category', debt.category);
    setValue('totalAmount', debt.totalAmount);
    setValue('totalInstallments', debt.totalInstallments);
    setValue('initialPaidInstallments', debt.initialPaidInstallments);
    setValue('isSubscription', debt.isSubscription);
    setValue('amountPerMonth', debt.amountPerMonth);
  };

  const isSubscription = watch("isSubscription");
  const tAmount = watch("totalAmount");
  const tInstallments = watch("totalInstallments");

  const calculateMonthly = () => {
    const total = parseFloat(tAmount?.toString() || "0");
    const inst = parseInt(tInstallments?.toString() || "1");
    if (total && inst > 0) {
      setValue('amountPerMonth', (total / inst).toFixed(2) as any);
    }
  };

  const saveAll = async () => {
    try {
      if (debtToEdit) {
        // MODO EDICIÓN REAL (DB)
        const data = watch();
        // IMPORTANTE: El esquema del backend requiere accountId siempre
        await updateDebt(debtToEdit.id, {
          title: data.title,
          category: data.category,
          isSubscription: data.isSubscription,
          accountId: card.id, // Campo faltante que causaba el error 400
          totalAmount: parseFloat(data.totalAmount?.toString() || "0"),
          amountPerMonth: parseFloat(data.amountPerMonth?.toString() || "0"),
          totalInstallments: parseInt(data.totalInstallments as any),
          initialPaidInstallments: parseInt(data.initialPaidInstallments as any),
        });
        toast.success("Gasto actualizado correctamente");
      } else {
        // MODO CREACIÓN MASIVA
        await Promise.all(tempDebts.map(debt => addDebt({
          ...debt,
          accountId: card.id,
          totalAmount: parseFloat(debt.totalAmount),
          amountPerMonth: parseFloat(debt.amountPerMonth),
          totalInstallments: parseInt(debt.totalInstallments),
          initialPaidInstallments: parseInt(debt.initialPaidInstallments),
        })));
        setTempDebts([]);
        toast.success("Gastos cargados correctamente");
      }

      onSuccess();
    } catch (e: any) {
      console.error("Error saving debt:", e);
      toast.error("Error al procesar la solicitud");
    }
  };

  if (!isOpen) return null;

  const isEditingReal = !!debtToEdit;

  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center p-4 bg-[#2e1065]/80 backdrop-blur-md">
      <div className="bg-[#1e1b4b] w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-[3.5rem] shadow-2xl flex flex-col border border-white/10">

        {/* Header */}
        <div className="p-8 pb-4 flex justify-between items-center">
          <div>
            <h3 className="text-white text-3xl font-black italic tracking-tight">
              {isEditingReal ? 'Editar Gasto' : 'Carga Rápida'}
            </h3>
            <p className="text-violet-300/60 text-xs font-bold uppercase tracking-widest">
              {isEditingReal ? 'Modificá los detalles del consumo' : 'Agregá tus consumos'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 pt-4 space-y-8">
          {/* Formulario de entrada */}
          <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-violet-300 uppercase ml-2">¿Qué compraste?</label>
                <input {...register("title")} placeholder="Ej: Zapatillas" className={`w-full bg-white/5 border-none p-4 rounded-2xl text-white placeholder:text-white/20 focus:ring-2 ${errors.title ? 'ring-2 ring-red-500' : 'focus:ring-violet-500'}`} />
                {errors.title && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold">{(errors.title as any).message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-violet-300 uppercase ml-2 ">Total $</label>
                <input {...register("totalAmount", { valueAsNumber: true })} onBlur={calculateMonthly} type="number" className={`w-full bg-white/5 border-none p-4 rounded-2xl text-white ${errors.totalAmount ? 'ring-2 ring-red-500' : ''}`} />
                {errors.totalAmount && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold">{(errors.totalAmount as any).message}</p>}
              </div>

              {!isSubscription && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-violet-300 uppercase ml-2">Cuotas</label>
                    <input {...register("totalInstallments", { valueAsNumber: true })} onBlur={calculateMonthly} type="number" className={`w-full bg-white/5 border-none p-4 rounded-2xl text-white ${errors.totalInstallments ? 'ring-2 ring-red-500' : ''}`} />
                    {errors.totalInstallments && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold">{(errors.totalInstallments as any).message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-violet-300 uppercase ml-2">Ya pagaste</label>
                    <input {...register("initialPaidInstallments", { valueAsNumber: true })} type="number" className={`w-full bg-white/5 border-none p-4 rounded-2xl text-white ${errors.initialPaidInstallments ? 'ring-2 ring-red-500' : ''}`} />
                    {errors.initialPaidInstallments && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold">{(errors.initialPaidInstallments as any).message}</p>}
                  </div>
                </>
              )}
            </div>

            {!isSubscription && (
              <div className="space-y-1">
                <label className="text-[10px] font-black text-violet-300 uppercase ml-2">Categoría</label>
                <select {...register("category")} className="w-full bg-white/5 border-none p-4 rounded-2xl text-white focus:ring-2 focus:ring-violet-500">
                  <option value="Ropa">Ropa</option>
                  <option value="Supermercado">Supermercado</option>
                  <option value="Tecnología">Tecnología</option>
                  <option value="Suscripción">Suscripción</option>
                  <option value="Varios">Varios</option>
                </select>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input type="checkbox" {...register("isSubscription")} className="sr-only peer" />
                  <div className="w-10 h-6 bg-white/10 rounded-full peer peer-checked:bg-violet-500 transition-colors" />
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4 transition-transform" />
                </div>
                <span className="text-xs font-bold text-white/60 group-hover:text-white transition-colors uppercase">Es suscripción</span>
              </label>

              {!isEditingReal && (
                <button
                  type="button"
                  onClick={handleSubmit(addToTempList)}
                  className="bg-white/10 hover:bg-white text-white hover:text-[#1e1b4b] px-6 py-3 rounded-2xl font-black text-xs uppercase transition-all flex items-center gap-2"
                >
                  <PlusIcon className="w-4 h-4 stroke-[3px]" /> Agregar a la lista
                </button>
              )}
            </div>
          </div>

          {!isEditingReal && tempDebts.length > 0 && (
            <div className="space-y-3">
              <p className="text-[10px] font-black text-violet-300 uppercase ml-2 tracking-widest">Pendientes por subir ({tempDebts.length})</p>
              {tempDebts.map((debt) => (
                <div key={debt.id} className={`flex items-center justify-between p-4 rounded-3xl border transition-all ${editingTempId === debt.id ? 'bg-violet-500/20 border-violet-500' : 'bg-white/5 border-white/5'}`}>
                  <div>
                    <p className="text-white font-bold">{debt.title} {editingTempId === debt.id && <span className="text-[10px] bg-violet-500 px-2 py-0.5 rounded-full ml-2">EDITANDO</span>}</p>
                    <p className="text-white/40 text-[10px] uppercase font-black">
                      {debt.isSubscription ? `Suscripción de $${parseFloat(debt.amountPerMonth).toLocaleString()}` :
                        `${parseFloat(debt.amountPerMonth).toLocaleString()} x ${debt.totalInstallments} cuotas`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEditTemp(debt)} className="p-2 text-violet-300 hover:bg-violet-500/20 rounded-xl transition-colors">
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => setTempDebts(tempDebts.filter(d => d.id !== debt.id))} className="p-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-8 bg-white/5 border-t border-white/5 flex gap-4">
          <button onClick={onClose} className="flex-1 p-5 rounded-3xl text-white/40 font-black uppercase text-xs hover:text-white transition-colors">
            Cancelar
          </button>
          <button
            onClick={handleSubmit(saveAll)}
            disabled={( !isEditingReal && tempDebts.length === 0 ) || adding || updating}
            className="flex-2 bg-white disabled:bg-white/10 disabled:text-white/20 text-[#1e1b4b] p-5 rounded-4xl font-black uppercase text-xs shadow-xl transition-all flex items-center justify-center gap-2"
          >
            {adding || updating ? "Procesando..." : (
              <><CheckIcon className="w-5 h-5 stroke-[3px]" /> {isEditingReal ? 'Guardar Cambios' : 'Confirmar todos los gastos'}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};