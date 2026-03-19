import { useState } from "react"

const DebtFilters = () => {
  const [filter, setFilter] = useState("all")

  return (
    <div className="flex gap-4 mb-4">
      {["all", "pending", "paid"].map((f) => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={`px-3 py-1 rounded-md border ${
            filter === f
              ? "bg-white text-violet-700 border-white"
              : "bg-violet-700 border-gray-500"
          }`}
        >
          {f === "all" ? "Todas" : f === "pending" ? "Pendientes" : "Pagadas"}
        </button>
      ))}
    </div>
  )
}

export default DebtFilters