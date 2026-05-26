import { useState } from 'react';
import { DEBT_CATEGORIES } from '../types';

interface DebtFormFieldsProps {
  register: any;
  watch: any;
  setValue: any;
}

export const DebtFormFields = ({ register, watch, setValue }: DebtFormFieldsProps) => {
  const isSubscription = watch("isSubscription");
  const [lastEditedField, setLastEditedField] = useState<'total' | 'installment'>('total');

  const handleTotalChange = (valStr: string) => {
    setLastEditedField('total');
    const total = parseFloat(valStr || "0");
    const inst = parseInt(watch("totalInstallments")?.toString() || "1");
    if (inst > 0) {
      setValue("amountPerMonth", (total / inst).toFixed(2));
    }
  };

  const handleInstallmentChange = (valStr: string) => {
    setLastEditedField('installment');
    const monthly = parseFloat(valStr || "0");
    const inst = parseInt(watch("totalInstallments")?.toString() || "1");
    setValue("totalAmount", (monthly * inst).toFixed(2));
  };

  const handleInstallmentsChange = (valStr: string) => {
    const inst = parseInt(valStr || "1");
    if (inst <= 0) return;
    if (lastEditedField === 'installment') {
      const monthly = parseFloat(watch("amountPerMonth")?.toString() || "0");
      setValue("totalAmount", (monthly * inst).toFixed(2));
    } else {
      const total = parseFloat(watch("totalAmount")?.toString() || "0");
      setValue("amountPerMonth", (total / inst).toFixed(2));
    }
  };

  return (
    <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/5 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-violet-300 uppercase ml-2 tracking-widest">
            ¿Qué compraste?
          </label>
          <input
            {...register("title", { required: true })}
            placeholder="Ej: Zapatillas, Netflix..."
            className="w-full bg-white/5 border-none p-4 rounded-2xl text-white placeholder:text-white/20 focus:ring-2 focus:ring-violet-500 transition-all outline-none"
          />
        </div>
        {
          !isSubscription && (
            <div className="space-y-1">
              <label className="text-[10px] font-black text-violet-300 uppercase ml-2 tracking-widest">
                Categoría
              </label>
              <select
                {...register("category")}
                className="w-full bg-white/5 border-none p-4 rounded-2xl text-white focus:ring-2 focus:ring-violet-500 appearance-none transition-all outline-none"
              >
                {DEBT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#1e1b4b]">
                    {cat}
                  </option>
                ))}
              </select>
            </div>)
        }
      </div>

      {/* Switch de Suscripción */}
      <div className="flex items-center justify-between pt-2">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              {...register("isSubscription")}
              className="sr-only peer"
            />
            <div className="w-10 h-6 bg-white/10 rounded-full peer peer-checked:bg-violet-500 transition-colors" />
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4 transition-transform" />
          </div>
          <span className="text-xs font-bold text-white/60 group-hover:text-white transition-colors uppercase tracking-widest">
            Es una suscripción
          </span>
        </label>
      </div>

      {/* SECCIÓN DE MONTOS VINCULADOS */}
      <div className="bg-violet-500/5 p-5 rounded-[2rem] border border-violet-500/10 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-violet-300 uppercase ml-2 tracking-widest">
            Calculadora de Monto
          </span>
          <span className="text-[9px] font-bold text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
            {isSubscription ? 'Suscripción' : (lastEditedField === 'total' ? 'En base al total' : 'En base a la cuota')}
          </span>
        </div>

        {isSubscription ? (
          <div className="space-y-1">
            <label className="text-[10px] font-black text-violet-300 uppercase ml-2">Monto Mensual de Suscripción $</label>
            <input
              type="number"
              step="0.01"
              {...register("amountPerMonth")}
              onChange={(e) => {
                setValue("amountPerMonth", e.target.value);
                setValue("totalAmount", e.target.value);
              }}
              placeholder="Ej: 5500"
              className="w-full bg-white/5 border-none p-4 rounded-2xl text-white focus:ring-2 focus:ring-violet-500 outline-none"
            />
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
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center flex flex-col justify-center h-[56px] mt-1">
                <p className="text-[9px] text-violet-300/40 font-bold uppercase tracking-widest leading-none mb-1">
                  Fórmula del Gasto
                </p>
                <p className="text-xs text-white font-black leading-none italic">
                  {(() => {
                    const amt = parseFloat(watch("amountPerMonth") || "0");
                    const inst = parseInt(watch("totalInstallments") || "1");
                    const tot = parseFloat(watch("totalAmount") || "0");
                    return `${inst} cuotas de $${amt.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} = $${tot.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} total`;
                  })()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};