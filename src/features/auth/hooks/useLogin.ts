import { useState } from "react"
import { login } from "../api/login.api"

export const useLogin = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const doLogin = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await login({ email, password })
      setLoading(false)
      return data
    } catch (err: any) {
      setError(err.message || "Error desconocido")
      setLoading(false)
      return null
    }
  }

  return { doLogin, loading, error }
}