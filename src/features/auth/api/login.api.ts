import { loginSchema } from "../types"
import type { LoginFormData } from "../types"

export const login = async (data: LoginFormData) => {
  const parsed = loginSchema.safeParse(data)
  if (!parsed.success) {
    throw new Error("Datos de login inválidos")
  }

  try {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
      credentials: "include"
    })
    console.log("Login response:", res)
    if (!res.ok) throw new Error("Usuario o contraseña incorrectos")
    return res.json()
  } catch (error) {
    console.error("Login failed:", error)
    throw error
  }
}