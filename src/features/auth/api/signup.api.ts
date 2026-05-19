import { API_URL } from "@/config/api.config"
import type { SignupFormData } from "../types"

export const signup = async (data: SignupFormData) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })

  if (!res.ok) {
    throw new Error("No se pudo registrar el usuario")
  }

  return res.json()
}