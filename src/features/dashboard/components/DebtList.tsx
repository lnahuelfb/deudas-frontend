export const DebtsList = ({ debts }: { debts: any[] }) => (
  <ul className="space-y-2">
    {debts.map(debt => (
      <li key={debt.id} className="bg-violet-700 p-4 rounded-lg flex justify-between items-center">
        <div>
          <p className="font-semibold">{debt.name}</p>
          <p>$ {debt.amount}</p>
          <p className="text-sm text-white/70">{debt.date}</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-green-500 px-2 py-1 rounded">Pagar</button>
          <button className="bg-red-500 px-2 py-1 rounded">Eliminar</button>
        </div>
      </li>
    ))}
  </ul>
);