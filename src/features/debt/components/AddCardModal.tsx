import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAddCard } from '../hooks/useCards';
import { cardSchema } from '@/features/debt/types';
import { XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import type { Card } from '@/features/debt/types';
import { useState, useEffect } from 'react';

const PRESET_COLORS = ["#7c3aed", "#4c1d95", "#db2777", "#2563eb", "#059669", "#d97706", "#1e293b"];

export const AddCardModal = ({ isOpen, onClose }: any) => {
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const BRANDS = ["Visa", "Mastercard", "American Express", "Naranja", "Mercado Pago", "Otra"] as const;

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<any>({
    resolver: zodResolver(cardSchema) as any,
    defaultValues: { color: "#7c3aed", brand: "Visa", type: "CREDIT_CARD", name: "" }
  });

  const selectedColor = watch('color');
  const currentBrand = watch('brand');

  const { addCard, loading, error } = useAddCard();

  // Cerrar el selector de marcas si hacés clic afuera
  useEffect(() => {
    if (!isBrandOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      const container = document.getElementById('brand-selector-container');
      if (container && !container.contains(e.target as Node)) {
        setIsBrandOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isBrandOpen]);

  const onSubmit = async (data: Card) => {
    try{
      const newCard = await addCard(data);
      if (newCard) {
        console.log("Nueva tarjeta creada:", newCard);
        onClose();
      }
    } catch (err) {
      console.error("Error al crear la tarjeta:", err);
    }
  };

  if (!isOpen) return null;
 
  const isPersonal = watch('type') === 'PERSONAL';
  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-[#0a071b]/95">
      <div className="relative w-full max-w-lg bg-[#1e1b4b] rounded-[3.5rem] p-8 shadow-2xl flex flex-col border border-white/10 animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-white text-3xl font-black italic tracking-tight">
              {isPersonal ? 'Nueva Cuenta' : 'Nueva Tarjeta'}
            </h2>
            <p className="text-violet-300/60 text-xs font-bold uppercase tracking-widest">
              {isPersonal ? 'Registrá una deuda informal o personal' : 'Agregá un plástico bancario'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-2xl hover:bg-white/10 transition-all text-white">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
 
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-white">
          <div
            className="w-full h-32 rounded-3xl p-6 flex flex-col justify-between shadow-lg transition-colors duration-500"
            style={{ backgroundColor: selectedColor }}
          >
            <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">
              {watch('type') === 'PERSONAL' ? 'Deuda Personal' : (watch('brand') || 'Visa')}
            </p>
            <p className="text-white text-xl font-black truncate">{watch('name') || 'Nombre de la Cuenta'}</p>
          </div>

          <div>
            <label className="text-xs font-bold uppercase ml-2 text-violet-300/80 tracking-wider">Nombre</label>
            <input
              {...register('name')}
              placeholder={isPersonal ? "Ej: Deuda con Juan" : "Ej: Visa Santander"}
              className="w-full p-4 mt-1 rounded-2xl bg-white/5 border border-white/5 focus:border-[#7c3aed] text-white placeholder:text-white/20 outline-none transition-colors"
            />
            {errors.name ? <p className="text-red-400 text-[10px] mt-1 ml-2 font-bold">{(errors.name as any).message}</p> : null}
          </div>
 
          {/* Selector de Tipo de Cuenta */}
          <div>
            <label className="text-xs font-bold uppercase ml-2 text-violet-300/80 tracking-wider">Tipo de Cuenta</label>
            <div className="grid grid-cols-2 gap-3 mt-1.5">
              <button
                type="button"
                onClick={() => {
                  setValue('type', 'CREDIT_CARD');
                  setValue('brand', 'Visa');
                }}
                className={`p-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all border ${watch('type') === 'CREDIT_CARD' ? 'bg-violet-500 text-white border-violet-500 shadow-lg shadow-violet-500/20' : 'bg-white/5 text-white/50 border-white/5 hover:bg-white/10 hover:text-white'}`}
              >
                Tarjeta
              </button>
              <button
                type="button"
                onClick={() => {
                  setValue('type', 'PERSONAL');
                  setValue('brand', 'Personal');
                  setValue('closingDay', null);
                  setValue('dueDay', null);
                }}
                className={`p-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all border ${watch('type') === 'PERSONAL' ? 'bg-violet-500 text-white border-violet-500 shadow-lg shadow-violet-500/20' : 'bg-white/5 text-white/50 border-white/5 hover:bg-white/10 hover:text-white'}`}
              >
                Personal
              </button>
            </div>
          </div>
 
          {watch('type') === 'CREDIT_CARD' && (
            <div className="space-y-4">
              {/* Selector de Marca */}
              <div id="brand-selector-container" className="space-y-1 relative">
                <label className="text-xs font-bold uppercase ml-2 text-violet-300/80 tracking-wider">Marca / Proveedor</label>
                <input type="hidden" {...register("brand")} />
                
                <button
                  type="button"
                  onClick={() => setIsBrandOpen(!isBrandOpen)}
                  className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl text-white flex justify-between items-center hover:bg-white/10 transition-colors focus:border-[#7c3aed] outline-none"
                >
                  <span className="font-medium text-sm">{currentBrand || 'Seleccionar...'}</span>
                  <ChevronDownIcon className={`w-4 h-4 text-violet-300 transition-transform duration-200 ${isBrandOpen ? 'rotate-180' : ''}`} />
                </button>

                {isBrandOpen && (
                  <div className="absolute top-[100%] left-0 w-full mt-1 bg-[#2e1065] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    {BRANDS.map((br) => (
                      <button
                        key={br}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setValue('brand', br);
                          setIsBrandOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-violet-500 hover:text-white cursor-pointer border-b border-white/5 last:border-0 ${currentBrand === br ? 'bg-violet-500/30 text-white font-bold' : 'text-white/70'}`}
                      >
                        {br}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase ml-2 text-violet-300/80 tracking-wider">Cierra el día</label>
                  <input
                    type="number"
                    {...register('closingDay', { valueAsNumber: true })}
                    placeholder="Ej: 25"
                    className="w-full p-4 mt-1 rounded-2xl bg-white/5 border border-white/5 focus:border-[#7c3aed] text-white placeholder:text-white/20 outline-none transition-colors"
                  />
                  {errors.closingDay ? <p className="text-red-400 text-[10px] mt-1 ml-2 font-bold">{(errors.closingDay as any).message}</p> : null}
                </div>
                <div>
                  <label className="text-xs font-bold uppercase ml-2 text-violet-300/80 tracking-wider">Vence el día</label>
                  <input
                    type="number"
                    {...register('dueDay', { valueAsNumber: true })}
                    placeholder="Ej: 5"
                    className="w-full p-4 mt-1 rounded-2xl bg-white/5 border border-white/5 focus:border-[#7c3aed] text-white placeholder:text-white/20 outline-none transition-colors"
                  />
                  {errors.dueDay ? <p className="text-red-400 text-[10px] mt-1 ml-2 font-bold">{(errors.dueDay as any).message}</p> : null}
                </div>
              </div>
            </div>
          )}

          {/* Selector de Color */}
          <div>
            <label className="text-xs font-bold uppercase ml-2 text-violet-300/80 tracking-wider block mb-3">Elegí el color de tu plástico</label>
            <div className="flex flex-wrap gap-3 px-2">
              {PRESET_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue('color', color)}
                  className={`w-9 h-9 rounded-full border-2 transition-all cursor-pointer ${selectedColor === color ? 'border-white scale-110 shadow-lg shadow-white/10' : 'border-transparent opacity-50 hover:opacity-100 hover:scale-105'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
 
          {error && <p className="text-red-400 text-[10px] mt-1 ml-2 font-bold">{error}</p>}
 
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white disabled:bg-white/10 disabled:text-white/20 text-[#1e1b4b] font-black p-5 rounded-4xl mt-4 hover:bg-violet-300 transition-all active:scale-95 disabled:cursor-not-allowed text-xs uppercase tracking-wider"
          >
            {loading ? "Creando..." : `Crear ${isPersonal ? 'Cuenta' : 'Tarjeta'}`}
          </button>

        </form>
      </div>
    </div>
  );
};