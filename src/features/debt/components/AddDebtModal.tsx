import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { debtSchema, DEBT_CATEGORIES } from '../types';
import { useAddDebt, useUpdateDebt } from '../hooks/useDebt';
import { XMarkIcon, PlusIcon, TrashIcon, CheckIcon, PencilIcon, ChevronDownIcon, ArrowDownTrayIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

export const AddDebtModal = ({ isOpen, onClose, card, onSuccess, debtToEdit = null }: any) => {
  const { addDebt, loading: adding } = useAddDebt();
  const { updateDebt, loading: updating } = useUpdateDebt();
  const [tempDebts, setTempDebts] = useState<any[]>([]);

  const { register, handleSubmit, watch, getValues, reset, setValue, formState: { errors } } = useForm({
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
      startDate: new Date().toISOString().split('T')[0],
    }
  });

  const downloadCSVTemplate = () => {
    const headers = "Titulo;Categoria;Monto Total;Cuotas Totales;Cuotas Pagadas;Es Suscripcion (SI/NO);Fecha Compra (DD-MM-AAAA)\n";
    const example = "Zapatillas;Ropa;120000;3;0;NO;19-05-2026\nNetflix;Suscripcion;7000;1;0;SI;19-05-2026";
    
    // Usamos UTF-8 BOM para que Excel en Windows interprete correctamente caracteres en español
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), headers + example], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "plantilla_gastos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) return;

        const lines = text.split(/\r?\n/);
        const importedDebts: any[] = [];

        // Saltamos los headers en la línea 0
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          // Delimitador compatible (punto y coma en español, o coma)
          const delimiter = line.includes(';') ? ';' : ',';
          const cols = line.split(delimiter).map(c => c.trim().replace(/^["']|["']$/g, ''));
          if (cols.length < 3) continue;

          const title = cols[0];
          const category = cols[1] || 'Varios';
          const totalAmount = parseFloat(cols[2]) || 0;
          const totalInstallments = parseInt(cols[3]) || 1;
          const initialPaidInstallments = parseInt(cols[4]) || 0;
          const isSubscription = cols[5]?.toLowerCase() === 'si' || cols[5]?.toLowerCase() === 's' || cols[5]?.toLowerCase() === 'true';
          let startDateInput = cols[6];
          let startDate = new Date().toISOString().split('T')[0];

          if (startDateInput) {
            // Convertir DD-MM-AAAA o DD/MM/AAAA a AAAA-MM-DD para el motor de JS
            const cleanDate = startDateInput.replace(/\//g, '-');
            const parts = cleanDate.split('-');
            if (parts.length === 3) {
              if (parts[2].length === 4) {
                // Es DD-MM-AAAA
                startDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
              } else if (parts[0].length === 4) {
                // Es AAAA-MM-DD
                startDate = cleanDate;
              }
            }
          }

          if (!title) continue;

          const amountPerMonth = isSubscription ? totalAmount : (totalAmount / totalInstallments);

          importedDebts.push({
            id: Date.now() + i + Math.random(), // Temp unique key
            title,
            category,
            totalAmount,
            totalInstallments,
            initialPaidInstallments,
            isSubscription,
            startDate,
            amountPerMonth,
            accountId: card?.id || '',
          });
        }

        if (importedDebts.length > 0) {
          setTempDebts(prev => [...prev, ...importedDebts]);
          toast.success(`¡Cargados ${importedDebts.length} consumos en tu lista borrador!`);
        } else {
          toast.error("No se encontraron registros válidos en la planilla.");
        }
      } catch (err) {
        toast.error("Error al procesar el archivo CSV.");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const [editingTempId, setEditingTempId] = useState<number | null>(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const CATEGORIES = DEBT_CATEGORIES;

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
      setValue('startDate', debtToEdit.startDate ? new Date(debtToEdit.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
    } else if (!debtToEdit && isOpen) {
      reset();
    }
  }, [debtToEdit, isOpen, setValue, reset]);

  // Cerrar el selector de categorías si hacés clic afuera
  useEffect(() => {
    if (!isCategoryOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      const container = document.getElementById('category-selector-container');
      if (container && !container.contains(e.target as Node)) {
        setIsCategoryOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isCategoryOpen]);

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

  const [lastEditedField, setLastEditedField] = useState<'total' | 'installment'>('total');
  const isSubscription = watch("isSubscription");
  const currentCategory = watch("category");

  const handleTotalChange = (valStr: string) => {
    setLastEditedField('total');
    const total = parseFloat(valStr || "0");
    const inst = parseInt(watch("totalInstallments")?.toString() || "1");
    if (inst > 0) {
      setValue("amountPerMonth", (total / inst).toFixed(2) as any);
    }
  };

  const handleInstallmentChange = (valStr: string) => {
    setLastEditedField('installment');
    const monthly = parseFloat(valStr || "0");
    const inst = parseInt(watch("totalInstallments")?.toString() || "1");
    setValue("totalAmount", (monthly * inst).toFixed(2) as any);
  };

  const handleInstallmentsChange = (valStr: string) => {
    const inst = parseInt(valStr || "1");
    if (inst <= 0) return;
    if (lastEditedField === 'installment') {
      const monthly = parseFloat(watch("amountPerMonth")?.toString() || "0");
      setValue("totalAmount", (monthly * inst).toFixed(2) as any);
    } else {
      const total = parseFloat(watch("totalAmount")?.toString() || "0");
      setValue("amountPerMonth", (total / inst).toFixed(2) as any);
    }
  };

  const handleFinalSubmit = async () => {
    if (debtToEdit) {
      // Si estamos editando, forzamos validación y enviamos
      handleSubmit(saveAll)();
      return;
    }

    const currentTitle = getValues('title');
    
    // Si hay texto en el título, asumimos que el usuario quiere guardar lo que está escribiendo
    if (currentTitle && currentTitle.trim() !== '') {
      handleSubmit(async (data) => {
        // Validó correctamente el formulario actual. Agregamos a la lista temporal y guardamos todo.
        const allDebts = [...tempDebts, { ...data, id: Date.now() }];
        await executeMassiveCreate(allDebts);
      })();
    } else {
      // El formulario está vacío. 
      if (tempDebts.length > 0) {
        // Si hay cosas en la lista, simplemente las guardamos ignorando el formulario vacío
        await executeMassiveCreate(tempDebts);
      } else {
        // No hay nada en la lista y el form está vacío -> Forzamos errores para que el usuario sepa
        handleSubmit(saveAll)();
      }
    }
  };

  const executeMassiveCreate = async (debtsList: any[]) => {
    try {
      await Promise.all(debtsList.map(debt => addDebt({
        ...debt,
        accountId: card.id,
        totalAmount: parseFloat(debt.totalAmount?.toString() || "0"),
        amountPerMonth: parseFloat(debt.amountPerMonth?.toString() || "0"),
        totalInstallments: parseInt(debt.totalInstallments?.toString() || "1"),
        initialPaidInstallments: parseInt(debt.initialPaidInstallments?.toString() || "0"),
        startDate: new Date(debt.startDate || new Date()).toISOString(),
      })));
      setTempDebts([]);
      reset();
      toast.success("Gastos cargados correctamente");
      onSuccess();
    } catch (e: any) {
      console.error("Error saving debt:", e);
      toast.error("Error al procesar la solicitud");
    }
  };

  const saveAll = async (data: any) => {
    try {
      if (debtToEdit) {
        // MODO EDICIÓN REAL (DB)
        await updateDebt(debtToEdit.id, {
          title: data.title,
          category: data.category,
          isSubscription: data.isSubscription,
          accountId: card.id,
          totalAmount: parseFloat(data.totalAmount?.toString() || "0"),
          amountPerMonth: parseFloat(data.amountPerMonth?.toString() || "0"),
          totalInstallments: parseInt(data.totalInstallments?.toString() || "1"),
          initialPaidInstallments: parseInt(data.initialPaidInstallments?.toString() || "0"),
          startDate: new Date(data.startDate || new Date()).toISOString(),
        });
        toast.success("Gasto actualizado correctamente");
        onSuccess();
      }
    } catch (e: any) {
      console.error("Error saving debt:", e);
      toast.error("Error al procesar la solicitud");
    }
  };

  if (!isOpen) return null;

  const isEditingReal = !!debtToEdit;

  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center p-4 bg-[#0a071b]/95">
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

        <div className="flex-1 overflow-y-auto p-8 pt-4 space-y-6">
          {/* Sección de carga masiva por archivo */}
          {!isEditingReal && (
            <div className="flex flex-col sm:flex-row gap-4 p-5 bg-violet-500/10 rounded-[2.5rem] border border-violet-500/10 items-start sm:items-center justify-between">
              <div>
                <p className="text-white text-xs font-black uppercase tracking-wider">Carga masiva con Excel / CSV</p>
                <p className="text-violet-300/60 text-[10px] font-bold">Subí un lote entero de gastos de una sola vez.</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={downloadCSVTemplate}
                  className="flex-1 sm:flex-initial bg-white/5 hover:bg-white/10 text-white p-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95 border border-white/5"
                  title="Descargar Plantilla CSV"
                >
                  <ArrowDownTrayIcon className="w-4 h-4 text-violet-300" />
                  <span>Plantilla</span>
                </button>
                <label
                  className="flex-1 sm:flex-initial bg-violet-500 hover:bg-violet-400 text-white p-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-lg shadow-violet-500/25"
                  title="Subir archivo CSV"
                >
                  <DocumentArrowUpIcon className="w-4 h-4" />
                  <span>Subir CSV</span>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCSVUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Formulario de entrada */}
          <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-violet-300 uppercase ml-2">¿Qué compraste?</label>
                <input {...register("title")} placeholder="Ej: Zapatillas" className={`w-full bg-white/5 border-none p-4 rounded-2xl text-white placeholder:text-white/20 focus:ring-2 ${errors.title ? 'ring-2 ring-red-500' : 'focus:ring-violet-500'}`} />
                {errors.title && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold">{(errors.title as any).message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-violet-300 uppercase ml-2">Fecha de compra</label>
                <input {...register("startDate")} type="date" className={`w-full bg-white/5 border-none p-4 rounded-2xl text-white focus:ring-2 focus:ring-violet-500`} style={{ colorScheme: "dark" }} />
                {errors.startDate && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold">{(errors.startDate as any).message}</p>}
              </div>

            </div>

            {/* SECCIÓN DE MONTOS VINCULADOS (CALCULADORA BIDIRECCIONAL) */}
            <div className="bg-violet-500/5 p-5 rounded-[2.5rem] border border-violet-500/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-violet-300 uppercase ml-2 tracking-widest">
                  Monto y Financiación
                </span>
                <span className="text-[9px] font-bold text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {isSubscription ? 'Suscripción Mensual' : (lastEditedField === 'total' ? 'Basado en el Total' : 'Basado en la Cuota')}
                </span>
              </div>

              {isSubscription ? (
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-violet-300 uppercase ml-2">Monto de la Suscripción $</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("amountPerMonth")}
                    onChange={(e) => {
                      setValue("amountPerMonth", e.target.value);
                      setValue("totalAmount", e.target.value);
                    }}
                    placeholder="Ej: 5500"
                    className="w-full bg-white/5 border-none p-4 rounded-2xl text-white placeholder:text-white/20 focus:ring-2 focus:ring-violet-500 outline-none"
                  />
                  {errors.amountPerMonth && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold">{(errors.amountPerMonth as any).message}</p>}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-violet-300 uppercase ml-2">Monto Total $</label>
                      <input
                        type="number"
                        step="0.01"
                        {...register("totalAmount")}
                        onChange={(e) => handleTotalChange(e.target.value)}
                        placeholder="Ej: 120000"
                        className={`w-full bg-white/5 border-none p-4 rounded-2xl text-white focus:ring-2 focus:ring-violet-500 outline-none ${lastEditedField === 'total' ? 'ring-1 ring-violet-500/30 bg-violet-500/5' : ''}`}
                      />
                      {errors.totalAmount && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold">{(errors.totalAmount as any).message}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-violet-300 uppercase ml-2">Cuotas</label>
                      <input
                        type="number"
                        {...register("totalInstallments")}
                        onChange={(e) => handleInstallmentsChange(e.target.value)}
                        placeholder="Ej: 6"
                        className="w-full bg-white/5 border-none p-4 rounded-2xl text-white focus:ring-2 focus:ring-violet-500 outline-none"
                      />
                      {errors.totalInstallments && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold">{(errors.totalInstallments as any).message}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-violet-300 uppercase ml-2">Monto por Cuota $</label>
                      <input
                        type="number"
                        step="0.01"
                        {...register("amountPerMonth")}
                        onChange={(e) => handleInstallmentChange(e.target.value)}
                        placeholder="Ej: 20000"
                        className={`w-full bg-white/5 border-none p-4 rounded-2xl text-white focus:ring-2 focus:ring-violet-500 outline-none ${lastEditedField === 'installment' ? 'ring-1 ring-violet-500/30 bg-violet-500/5' : ''}`}
                      />
                      {errors.amountPerMonth && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold">{(errors.amountPerMonth as any).message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-violet-300 uppercase ml-2">Ya pagaste (cuotas)</label>
                      <input
                        type="number"
                        {...register("initialPaidInstallments")}
                        placeholder="Ej: 0"
                        className="w-full bg-white/5 border-none p-4 rounded-2xl text-white focus:ring-2 focus:ring-violet-500 outline-none"
                      />
                      {errors.initialPaidInstallments && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold">{(errors.initialPaidInstallments as any).message}</p>}
                    </div>

                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center flex flex-col justify-center h-[56px] mt-1">
                      <p className="text-[9px] text-violet-300/40 font-bold uppercase tracking-widest leading-none mb-1">
                        Fórmula del Gasto
                      </p>
                      <p className="text-xs text-white font-black leading-none italic">
                        {(() => {
                          const amt = parseFloat((watch("amountPerMonth") as any) || "0");
                          const inst = parseInt((watch("totalInstallments") as any) || "1");
                          const tot = parseFloat((watch("totalAmount") as any) || "0");
                          return `${inst} cuotas de $${amt.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} = $${tot.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} total`;
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!isSubscription && (
              <div id="category-selector-container" className="space-y-1 relative">
                <label className="text-[10px] font-black text-violet-300 uppercase ml-2">Categoría</label>
                <input type="hidden" {...register("category")} />
                
                <button
                  type="button"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="w-full bg-white/5 border-none p-4 rounded-2xl text-white flex justify-between items-center hover:bg-white/10 transition-colors focus:ring-2 focus:ring-violet-500 outline-none"
                >
                  <span className="font-medium text-sm">{currentCategory || 'Seleccionar...'}</span>
                  <ChevronDownIcon className={`w-4 h-4 text-violet-300 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCategoryOpen && (
                  <div className="absolute top-[100%] left-0 w-full mt-1 bg-[#2e1065] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setValue('category', cat);
                          setIsCategoryOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-violet-500 hover:text-white cursor-pointer border-b border-white/5 last:border-0 ${currentCategory === cat ? 'bg-violet-500/30 text-white font-bold' : 'text-white/70'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
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
                      {debt.isSubscription ? `Suscripción de $${parseFloat(debt.amountPerMonth).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` :
                        `${parseFloat(debt.amountPerMonth).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} x ${debt.totalInstallments} cuotas`}
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
            onClick={handleFinalSubmit}
            disabled={adding || updating}
            className="flex-2 bg-white disabled:bg-white/10 disabled:text-white/20 text-[#1e1b4b] p-5 rounded-4xl font-black uppercase text-xs shadow-xl transition-all flex items-center justify-center gap-2"
          >
            {adding || updating ? "Procesando..." : (
              <><CheckIcon className="w-5 h-5 stroke-[3px]" /> {isEditingReal ? 'Guardar Cambios' : (tempDebts.length > 0 ? 'Confirmar todos' : 'Confirmar gasto')}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};