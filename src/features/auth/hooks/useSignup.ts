import { useState } from "react"
import { signup } from "../api/signup.api"

export const useSignup = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const doSignup = async (name: string, email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const data = await signup({ name, email, password })
      return data
    } catch (err: any) {
      setError(err.message || "Error desconocido")
      return null
    } finally {
      setLoading(false)
    }
  }

  return { doSignup, loading, error }
}