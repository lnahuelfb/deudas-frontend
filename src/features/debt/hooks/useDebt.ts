import { useEffect, useState } from "react"
import { createDebt, fetchDebts } from "../api/debt.api";
import type { Debt } from "../types";

export const useDebt = (cardId?: string) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debts, setDebts] = useState<Debt[]>([])

  const loadDebts = async (cardId?: string) => {
    setLoading(true)
    setError(null)
    try {
      const data: Debt[] = await fetchDebts(cardId)
      setDebts(data || [])
    } catch (err: any) {
      setError(err.message || "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDebts(cardId)
  }, [cardId])

  return { loading, error, debts, loadDebts }
}


export const useAddDebt = (data: Omit<Debt, "id">) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addDebt = async () => {
    setLoading(true)
    setError(null)
    try {
      const newDebt = await createDebt(data)
      setLoading(false)
      return newDebt
    } catch (err: any) {
      setError(err.message || "Error desconocido")
      setLoading(false)
      return null
    }

  }

  return { addDebt, loading, error }
}
