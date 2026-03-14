import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signupSchema } from "../types"
import type { SignupFormData } from "../types"
import { useSignup } from "../hooks/useSignup"

interface SignupFormProps {
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}

const SignupForm = ({ setLoggedIn }: SignupFormProps) => {
  const inputStyles = "mb-[10px] p-[8px] text-[16px] border-white border-2 rounded-md focus:outline-none focus:border-violet-500"

  const { register, handleSubmit, formState: { errors } } =
    useForm<SignupFormData>({
      resolver: zodResolver(signupSchema)
    })

  const { doSignup, loading, error } = useSignup()

  const onSubmit = async (data: SignupFormData) => {
    const result = await doSignup(data.name, data.email, data.password)
    if (result) setLoggedIn(true)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col w-75 mx-auto bg-violet-700 text-white border p-5 rounded-3xl"
    >
      <h2 className="text-[20px] font-bold mb-4">Registrate:</h2>

      <input
        type="text"
        placeholder="Name"
        {...register("name")}
        className={inputStyles}
      />
      {errors.name && (
        <span className="text-red-500 text-[12px]">
          {errors.name.message}
        </span>
      )}

      <input
        type="text"
        placeholder="Email"
        {...register("email")}
        className={inputStyles}
      />
      {errors.email && (
        <span className="text-red-500 text-[12px]">
          {errors.email.message}
        </span>
      )}

      <input
        type="password"
        placeholder="Password"
        {...register("password")}
        className={inputStyles}
      />
      {errors.password && (
        <span className="text-red-500 text-[12px]">
          {errors.password.message}
        </span>
      )}

      {error && (
        <span className="text-red-500 text-[12px] mb-2">
          {error}
        </span>
      )}

      <button
        type="submit"
        disabled={loading}
        className="p-2.5 text-[16px] bg-[white] text-violet-700 border-none cursor-pointer rounded-md hover:bg-gray-200 transition-colors duration-300 my-1.5"
      >
        {loading ? "Registrando..." : "Registrate"}
      </button>
    </form>
  )
}

export default SignupForm