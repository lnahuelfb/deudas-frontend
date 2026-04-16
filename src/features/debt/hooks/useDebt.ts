import { useEffect, useState, useCallback } from "react"
import { createDebt, fetchDebts, getAllDebts, updateDebt, deleteDebt } from "../api/debt.api";
import type { Debt } from "../types";

export const useDebt = (cardId?: string) => {
  const [loading, setLoading] = useState(false);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadDebts = useCallback(async () => {
    if (!cardId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await fetchDebts(cardId);
      setDebts(data || []);
    } catch (err) {
      console.error(err);
      setError("Error al cargar las deudas" + (err instanceof Error ? `: ${err.message}` : ""));
    } finally {
      setLoading(false);
    }
  }, [cardId]);

  useEffect(() => {
    if (cardId) {
      loadDebts();
    } else {
      setDebts([]);
    }
  }, [cardId, loadDebts]);

  return { debts, loading, error, fetchUserDebts: loadDebts };
};

export const useGetAllDebts = () => {
  const [data, setDebts] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getAllDebtData = async () => {
    setLoading(true)
    setError(null)
    try {
      const allDebts = await getAllDebts()
      setDebts(allDebts || [])
    } catch (err: any) {
      const msg = err.message || "Error al obtener la deuda"
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllDebtData()
  }, [])

  return { data, loading, error, getDebts: getAllDebtData }
}


export const useAddDebt = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addDebt = async (data: Debt) => {

    if (data.id) {
      delete data.id
    }

    setLoading(true)
    setError(null)
    try {
      const newDebt = await createDebt(data)
      return newDebt
    } catch (err: any) {
      const msg = err.message || "Error al crear la deuda"
      console.log(err)
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  return { addDebt, loading, error }
}

export const useDeleteDebt = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteDebtData = async (debtId: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await deleteDebt(debtId)
      return response
    } catch (err: any) {
      const msg = err.message || "Error al eliminar la deuda"
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  return { deleteDebt: deleteDebtData, loading, error }
}

export const useUpdateDebt = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateDebtData = async (debtId: string, data: Partial<Omit<Debt, "id" | "createdAt" | "updatedAt">>) => {
    setLoading(true)
    setError(null)
    try {
      const updatedDebt = await updateDebt(debtId, data)
      return updatedDebt
    } catch (err: any) {
      const msg = err.message || "Error al actualizar la deuda"
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  return { updateDebt: updateDebtData, loading, error }
}
