import {
  ShoppingBagIcon,
  TvIcon,
  SparklesIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckCircleIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
interface DebtItemRowProps {
  debt: any;
  onEdit?: (debt: any) => void;
  onDelete?: (id: string) => void;
}

export const DebtItemRow = ({ debt, onEdit, onDelete }: DebtItemRowProps) => {
  const isPaidOff = !debt.isSubscription && debt.paidInstallments === debt.totalInstallments;

  const getIcon = () => {
    if (isPaidOff) return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
    if (debt.isSubscription) return <TvIcon className="w-5 h-5 text-red-400" />;
    if (debt.category === 'Shopping' || debt.category === 'Ropa')
      return <ShoppingBagIcon className="w-5 h-5 text-emerald-400" />;
    return <SparklesIcon className="w-5 h-5 text-violet-400" />;
  };


  return (
    <div className="relative group flex items-center gap-4 p-5 bg-white/5 backdrop-blur-md rounded-4xl border border-white/5 hover:bg-white/10 transition-all">

      <div className={`p-3 rounded-2xl transition-transform group-hover:scale-110 ${isPaidOff ? 'bg-green-500/10' : 'bg-white/10'}`}>
        {getIcon()}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className={`font-bold text-white text-base truncate ${isPaidOff ? 'opacity-50 line-through' : ''}`}>
          {debt.title}
        </h4>
        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-violet-200/50">
          {debt.isSubscription ? (
            <span>Suscripción Mensual</span>
          ) : (
            <span className={isPaidOff ? 'text-green-400' : ''}>
              {isPaidOff ? 'Completado' : `Cuota ${debt.paidInstallments} de ${debt.totalInstallments}`}
            </span>
          )}
        </div>
      </div>

      <div className="text-right mr-2 transition-all group-hover:mr-10">
        <p className={`text-lg font-black text-white leading-none mb-1 ${isPaidOff ? 'opacity-40' : ''}`}>
          ${debt.amountPerMonth.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
        </p>
        {!debt.isSubscription && !isPaidOff && (
          <span className="text-[9px] font-black opacity-40 uppercase text-white whitespace-nowrap">
            Faltan ${debt.remainingAmount?.toLocaleString('es-AR')}
          </span>
        )}
      </div>

      <div className="absolute right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit?.(debt.id)} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors" title="Editar">
          <PencilIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete?.(debt.id)}
          className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-400 transition-colors"
          title="Eliminar"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};