import {useState} from "react"
import { createCard } from "../api/card.api";
import { type Card } from "../types";

export const useDebt = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addCard = async (data: Omit<Card, "id">) => {
    setLoading(true)
    setError(null)
    try {
      const newCard = await createCard(data)
      setLoading(false)
      return newCard
    } catch (err: any) {
      setError(err.message || "Error desconocido")
      setLoading(false)
      return null
    }
  }

  return { addCard, loading, error }
}