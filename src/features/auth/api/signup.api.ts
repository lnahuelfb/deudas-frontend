import type { SignupFormData } from "../types"

export const signup = async (data: SignupFormData) => {
  const res = await fetch("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })

  console.log("Signup response status:", res)

  if (!res.ok) {
    throw new Error("No se pudo registrar el usuario")
  }

  return res.json()
}