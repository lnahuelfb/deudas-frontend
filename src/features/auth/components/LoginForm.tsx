import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLogin } from "../hooks/useLogin"
import { loginSchema } from "../types"
import type { LoginFormData } from "../types"

interface LoginFormProps {
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}

const LoginForm = ({ setLoggedIn }: LoginFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const { doLogin, loading, error } = useLogin()

  const onSubmit = async (data: LoginFormData) => {
    const result = await doLogin(data.email, data.password)
    console.log("Login result:", result)
    if (result) setLoggedIn(true)
  }

  const inputStyles = "mb-[10px] p-[8px] text-[16px] border-white border-2 rounded-md focus:outline-none focus:border-violet-500"

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-75 mx-auto bg-violet-700 text-white border p-5 rounded-3xl">
      <h2 className="text-[20px] font-bold mb-4">Inicia sesion: </h2>

      <input type="text" placeholder="Email" {...register("email")} className={inputStyles} />
      {errors.email && <span className="text-red-500 text-[12px]">{errors.email.message}</span>}

      <input type="password" placeholder="Password" {...register("password")} className={inputStyles} />
      {errors.password && <span className="text-red-500 text-[12px]">{errors.password.message}</span>}

      {error && <span className="text-red-500 text-[12px] mb-2">{error}</span>}

      <a href="#" className="text-[14px] text-white hover:underline mb-2">¿Olvidaste tu contraseña?</a>

      <button type="submit" disabled={loading} className="p-2.5 text-[16px] bg-[white] text-violet-700 border-none cursor-pointer rounded-md hover:bg-gray-200 transition-colors duration-300 my-1.5">
        {loading ? "Cargando..." : "Login"}
      </button>
      <a href="/register" className="p-2.5 text-[16px] bg-[white] text-violet-700 border-none cursor-pointer rounded-md hover:bg-gray-200 transition-colors duration-300">
        Registrate
      </a>
    </form>
  )
}

export default LoginForm