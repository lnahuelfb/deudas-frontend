import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "../types";
import { Link } from "react-router-dom";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { requestPasswordReset } from "../api/reset-password.api";
import type { ForgotPasswordFormData } from "../types";

const ForgotPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    setError(null);
    try {
      await requestPasswordReset(data.email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Error al enviar el correo");
    } finally {
      setLoading(false);
    }
  };

  const inputWrapper = "flex items-center bg-white/10 border border-white/20 rounded-lg px-3 py-2 focus-within:border-violet-400 transition";
  const input = "bg-transparent outline-none text-white w-full text-sm placeholder:text-white/60";

  if (success) {
    return (
      <div className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl text-center text-white">
        <h2 className="text-2xl font-bold mb-4">¡Correo enviado!</h2>
        <p className="text-sm text-white/80 mb-6">
          Si el correo existe, recibirás un enlace para restablecer tu contraseña en los próximos minutos.
        </p>
        <Link to="/login" className="inline-block w-full py-2 rounded-lg bg-white text-violet-700 font-semibold hover:bg-gray-200 transition">
          Volver al login
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl"
    >
      <h2 className="text-2xl font-bold text-center mb-6 text-white">
        Recuperar contraseña
      </h2>
      <p className="text-sm text-white/70 text-center mb-6">
        Ingresa tu email y te enviaremos un enlace para recuperar el acceso a tu cuenta.
      </p>

      <div className="mb-4">
        <div className={inputWrapper}>
          <EnvelopeIcon className="h-5 w-5 text-white/70 mr-2" />
          <input
            type="email"
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

      {error && (
        <div className="text-red-400 text-sm mb-3 text-center">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded-lg bg-white text-violet-700 font-semibold hover:bg-gray-200 transition disabled:opacity-70"
      >
        {loading ? "Enviando..." : "Enviar enlace"}
      </button>

      <p className="text-sm text-white/80 text-center mt-4">
        ¿Te acordaste?{" "}
        <Link to="/login" className="text-white font-semibold hover:underline">
          Iniciá sesión
        </Link>
      </p>
    </form>
  );
};

export default ForgotPasswordForm;
