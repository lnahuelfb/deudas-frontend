import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cardSchema } from '@/features/debt/types';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Card } from '@/features/debt/types';

const PRESET_COLORS = ["#7c3aed", "#4c1d95", "#db2777", "#2563eb", "#059669", "#d97706", "#1e293b"];

export const AddCardModal = ({ isOpen, onClose, onSubmit }: any) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<Card>({
    resolver: zodResolver(cardSchema),
    defaultValues: { color: "#7c3aed", brand: "Visa" }
  });

  const selectedColor = watch('color');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#4c1d95]/60 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-[3rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[#4c1d95] text-2xl font-black italic">Nueva Tarjeta</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-all text-gray-500">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-[#4c1d95]">
          <div 
            className="w-full h-32 rounded-3xl p-6 flex flex-col justify-between shadow-lg transition-colors duration-500"
            style={{ backgroundColor: selectedColor }}
          >
            <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">{watch('brand') || 'Visa'}</p>
            <p className="text-white text-xl font-black truncate">{watch('name') || 'Nombre de la Tarjeta'}</p>
          </div>

          <div>
            <label className="text-xs font-bold uppercase ml-2 opacity-60 italic">Nombre</label>
            <input 
              {...register('name')}
              placeholder="Ej: Visa Santander"
              className="w-full p-4 mt-1 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#7c3aed] outline-none"
            />
            {errors.name && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase ml-2 opacity-60 italic">Cierra el día</label>
              <input 
                type="number" 
                {...register('closingDay', { valueAsNumber: true })}
                placeholder="Ej: 25"
                className="w-full p-4 mt-1 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#7c3aed] outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase ml-2 opacity-60 italic">Vence el día</label>
              <input 
                type="number" 
                {...register('dueDay', { valueAsNumber: true })}
                placeholder="Ej: 5"
                className="w-full p-4 mt-1 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#7c3aed] outline-none"
              />
            </div>
          </div>

          {/* Selector de Color */}
          <div>
            <label className="text-xs font-bold uppercase ml-2 opacity-60 italic block mb-2">Elegí un color</label>
            <div className="flex flex-wrap gap-3 px-2">
              {PRESET_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue('color', color)}
                  className={`w-10 h-10 rounded-full border-4 transition-all ${selectedColor === color ? 'border-gray-200 scale-110 shadow-lg' : 'border-transparent opacity-60'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#4c1d95] text-white font-black p-5 rounded-3xl mt-4 hover:bg-[#7c3aed] shadow-xl shadow-violet-200 transition-all active:scale-95"
            onClick={() => {
              const currentValues = watch();
              onSubmit(currentValues);
            }}
          >
            Crear Tarjeta
          </button>
        </form>
      </div>
    </div>
  );
};