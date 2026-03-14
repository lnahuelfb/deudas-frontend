import * as z from "zod"

export const authStateSchema = z.object({
  user: z.object({
    id: z.uuid({version: "v4"}),
    username: z.string().min(1, "El usuario es requerido"),
    email: z.string().email("El email no es válido")
  }).nullable(),
  token: z.string().nullable(),
  isAuthenticated: z.boolean()
})

export type AuthState = z.infer<typeof authStateSchema>

export const userSchema = z.object({
  id: z.uuidv4(),
  username: z.string().min(1, "El usuario es requerido"),
  email: z.string().email("El email no es válido")
})

export type User = z.infer<typeof userSchema>

export const loginSchema = z.object({
  email: z.string().min(1, "El usuario es requerido"),
  password: z.string().min(1, "La contraseña es requerida")
})

export type LoginFormData = z.infer<typeof loginSchema>

export const signupSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z
    .string()
    .email("El email no es válido"),

  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
})

export type SignupFormData = z.infer<typeof signupSchema>