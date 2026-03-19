import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "../hooks/useLogin";
import { loginSchema } from "../types";
import { useNavigate, Link } from "react-router-dom";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import type { LoginFormData } from "../types";

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const { doLogin, loading, error } = useLogin();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormData) => {
    const result = await doLogin(data.email, data.password);
    if (result) navigate("/");
  };

  const inputWrapper = "flex items-center bg-white/10 border border-white/20 rounded-lg px-3 py-2 focus-within:border-violet-400 transition";
  const input = "bg-transparent outline-none text-white w-full text-sm placeholder:text-white/60";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl"
    >
      <h2 className="text-2xl font-bold text-center mb-6 text-white">
        Iniciar sesión
      </h2>

      {/* Email */}
      <div className="mb-4">
        <div className={inputWrapper}>
          <EnvelopeIcon className="h-5 w-5 text-white/70 mr-2" />
          <input
            type="text"
            placeholder="Email"
            {...register("email")}
            className={input}
            disabled={loading}
          />
        </div>
        {errors.email && (
          <span className="text-red-400 text-xs mt-1 block">
            {errors.email.message}
          </span>
        )}
      </div>

      {/* Password */}
      <div className="mb-2">
        <div className={inputWrapper}>
          <LockClosedIcon className="h-5 w-5 text-white/70 mr-2" />
          <input
            type="password"
            placeholder="Contraseña"
            {...register("password")}
            className={input}
            disabled={loading}
          />
        </div>
        {errors.password && (
          <span className="text-red-400 text-xs mt-1 block">
            {errors.password.message}
          </span>
        )}
      </div>

      {/* Error backend */}
      {error && (
        <div className="text-red-400 text-sm mb-3 text-center">
          {error}
        </div>
      )}

      {/* Forgot password */}
      <div className="text-left mb-4">
        <Link
          to="/forgot-password"
          className="text-sm text-white/80 hover:text-white hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded-lg bg-white text-violet-700 font-semibold hover:bg-gray-200 transition disabled:opacity-70"
      >
        {loading ? "Cargando..." : "Ingresar"}
      </button>

      {/* Register */}
      <p className="text-sm text-white/80 text-center mt-4">
        ¿No tenés cuenta?{" "}
        <Link to="/register" className="text-white font-semibold hover:underline">
          Registrate
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;