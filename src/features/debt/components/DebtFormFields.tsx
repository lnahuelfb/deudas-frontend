interface DebtFormFieldsProps {
  register: any;
  watch: any;
  setValue: any;
}

export const DebtFormFields = ({ register, watch, setValue }: DebtFormFieldsProps) => {
  const isSubscription = watch("isSubscription");
  const tAmount = watch("totalAmount");
  const tInstallments = watch("totalInstallments");

  const calculateMonthly = () => {
    const total = parseFloat(tAmount);
    const inst = parseInt(tInstallments?.toString() || "1");
    if (total && inst > 0) {
      const monthly = (total / inst).toFixed(2);
      setValue('amountPerMonth', monthly);
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
            className="w-full bg-white/5 border-none p-4 rounded-2xl text-white placeholder:text-white/20 focus:ring-2 focus:ring-violet-500 transition-all"
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
                className="w-full bg-white/5 border-none p-4 rounded-2xl text-white focus:ring-2 focus:ring-violet-500 appearance-none transition-all"
              >
                <option value="Ropa" className="bg-[#1e1b4b]">Ropa</option>
                <option value="Supermercado" className="bg-[#1e1b4b]">Supermercado</option>
                <option value="Tecnología" className="bg-[#1e1b4b]">Tecnología</option>
                <option value="Suscripción" className="bg-[#1e1b4b]">Suscripción</option>
                <option value="Varios" className="bg-[#1e1b4b]">Varios</option>
              </select>
            </div>)
        }
      </div>

      {/* Fila 2: Montos y Cuotas */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-violet-300 uppercase ml-2 tracking-widest">
            Total $
          </label>
          <input
            {...register("totalAmount")}
            onBlur={calculateMonthly}
            type="number"
            step="0.01"
            className="w-full bg-white/5 border-none p-4 rounded-2xl text-white focus:ring-2 focus:ring-violet-500 transition-all"
          />
        </div>

        {!isSubscription && (
          <>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-violet-300 uppercase ml-2 tracking-widest">
                Cuotas
              </label>
              <input
                {...register("totalInstallments")}
                onBlur={calculateMonthly}
                type="number"
                className="w-full bg-white/5 border-none p-4 rounded-2xl text-white focus:ring-2 focus:ring-violet-500 transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-violet-300 uppercase ml-2 tracking-widest">
                Ya pagas
              </label>
              <input
                {...register("initialPaidInstallments")}
                type="number"
                className="w-full bg-white/5 border-none p-4 rounded-2xl text-white focus:ring-2 focus:ring-violet-500 transition-all"
              />
            </div>
          </>
        )}

        {isSubscription && (
          <div className="col-span-2 space-y-1">
            <label className="text-[10px] font-black text-violet-300 uppercase ml-2 tracking-widest opacity-30 italic">
              Info
            </label>
            <div className="p-4 rounded-2xl bg-white/5 text-white/40 text-[10px] font-bold uppercase flex items-center h-[56px]">
              Se cobrará todos los meses sin límite de cuotas
            </div>
          </div>
        )}
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

        <div className="text-right">
          <span className="text-[10px] font-black text-violet-300 uppercase block leading-none">Monto Mensual</span>
          <span className="text-xl font-black text-white italic">
            ${parseFloat(watch("amountPerMonth") || "0").toLocaleString('es-AR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
};