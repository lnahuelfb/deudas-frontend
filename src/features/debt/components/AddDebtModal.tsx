import { useState } from "react"

interface AddDebtModalProps {
  onClose: () => void
}

const AddDebtModal = ({ onClose }: AddDebtModalProps) => {
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Nueva deuda:", { name, amount })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-violet-700 p-6 rounded-2xl w-80 flex flex-col gap-4"
      >
        <h2 className="text-xl font-bold">Agregar Deuda</h2>
        <input
          type="text"
          placeholder="Nombre de la deuda"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 rounded-md text-black"
        />
        <input
          type="number"
          placeholder="Monto"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="p-2 rounded-md text-black"
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-md border border-white"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-3 py-1 rounded-md bg-white text-violet-700 hover:bg-gray-200 transition"
          >
            Agregar
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddDebtModal