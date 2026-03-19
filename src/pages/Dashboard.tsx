// import {}

const Dashboard = () => {

  const debts = [
    { id: 1, name: "Juan Pérez", amount: 5000, dueDate: "2024-07-15", paid: false, category: "Personal" },
    { id: 2, name: "María Gómez", amount: 3000, dueDate: "2024-08-01", paid: true, category: "Comida" },
    { id: 3, name: "Carlos López", amount: 2000, dueDate: "2024-09-10", paid: false, category: "Ropa" }
  ];

  const month = "07"

  const DebtsSummary = ({ debts }: { debts: any[] }) => {
    const total = debts.reduce((sum, d) => sum + d.amount, 0);
    const paid = debts.filter(d => d.paid).reduce((sum, d) => sum + d.amount, 0);

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

  const DebtsList = ({ debts }: { debts: any[] }) => (
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


  const AddDebtButton = () => {
    return (
      <button className="px-4 py-2 mt-2 bg-violet-700 rounded-lg hover:bg-violet-600 transition-colors">
        Agregar Nueva Deuda
      </button>
    )
  }

  return (
    <div className="min-h-screen p-6 bg-violet-950 text-white">
      <h1 className="text-2xl font-bold mb-4">Mis deudas</h1>

      <DebtsSummary debts={debts} />

      <DebtsList debts={debts} />

      <AddDebtButton />
    </div>
  )
}

export default Dashboard