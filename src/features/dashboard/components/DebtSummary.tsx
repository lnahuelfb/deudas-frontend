export const DebtsSummary = ({ debts }: { debts: any[] }) => {
  const total = debts.reduce((sum, d) => sum + d.amount, 0);
  const paid = debts.filter(d => d.paid).reduce((sum, d) => sum + d.amount, 0);

  const month = "07"

  return (
    <div className="flex gap-4 mb-6">
      <div className="bg-violet-700 p-4 rounded-lg flex-1">
        <p>Total de deuda</p>
        <p className="font-bold">$ {total}</p>
      </div>
      <div className="bg-blue-400 p-4 rounded-lg flex-1">
        <p>A pagar este mes</p>
        <p className="font-bold">$ {debts.filter(d => d.dueDate.split("-")[1] === month).reduce((sum, d) => sum + d.amount, 0)}</p>
      </div>
      <div className="bg-green-600 p-4 rounded-lg flex-1">
        <p>Pagado</p>
        <p className="font-bold">$ {paid}</p>
      </div>
      <div className="bg-red-600 p-4 rounded-lg flex-1">
        <p>Pendiente</p>
        <p className="font-bold">$ {total - paid}</p>
      </div>
    </div>
  );
};