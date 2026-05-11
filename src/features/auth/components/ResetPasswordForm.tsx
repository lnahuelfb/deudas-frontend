import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "../types";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { resetPassword } from "../api/reset-password.api";
import type { ResetPasswordFormData } from "../types";

const ResetPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema)
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError("Token de recuperación no encontrado");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await resetPassword(token, data.newPassword);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: any) {
      setError(err.message || "Error al restablecer la contraseña");
    } finally {
      setLoading(false);
    }
  };

  const inputWrapper = "flex items-center bg-white/10 border border-white/20 rounded-lg px-3 py-2 focus-within:border-violet-400 transition";
  const input = "bg-transparent outline-none text-white w-full text-sm placeholder:text-white/60";

  if (success) {
    return (
      <div className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl text-center text-white">
        <h2 className="text-2xl font-bold mb-4">¡Contraseña actualizada!</h2>
        <p className="text-sm text-white/80 mb-6">
          Tu contraseña ha sido cambiada correctamente. Redirigiendo al login...
        </p>
        <Link to="/login" className="inline-block w-full py-2 rounded-lg bg-white text-violet-700 font-semibold hover:bg-gray-200 transition">
          Ir al login ahora
        </Link>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl text-center text-white">
        <h2 className="text-2xl font-bold mb-4 text-red-400">Enlace inválido</h2>
        <p className="text-sm text-white/80 mb-6">
          El enlace de recuperación parece ser inválido o ha expirado.
        </p>
        <Link to="/forgot-password" title="Volver a intentar" className="inline-block w-full py-2 rounded-lg bg-white text-violet-700 font-semibold hover:bg-gray-200 transition">
          Volver a intentar
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
        Nueva contraseña
      </h2>
      <p className="text-sm text-white/70 text-center mb-6">
        Ingresa tu nueva contraseña para recuperar el acceso.
      </p>

      {/* New Password */}
      <div className="mb-4">
        <div className={inputWrapper}>
          <LockClosedIcon className="h-5 w-5 text-white/70 mr-2" />
          <input
            type="password"
            placeholder="Nueva contraseña"
            {...register("newPassword")}
            className={input}
            disabled={loading}
          />
        </div>
        {errors.newPassword && (
          <span className="text-red-400 text-xs mt-1 block">
            {errors.newPassword.message}
          </span>
        )}
      </div>

      {/* Confirm Password */}
      <div className="mb-4">
        <div className={inputWrapper}>
          <LockClosedIcon className="h-5 w-5 text-white/70 mr-2" />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            {...register("confirmPassword")}
            className={input}
            disabled={loading}
          />
        </div>
        {errors.confirmPassword && (
          <span className="text-red-400 text-xs mt-1 block">
            {errors.confirmPassword.message}
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
        {loading ? "Actualizando..." : "Restablecer contraseña"}
      </button>
    </form>
  );
};

export default ResetPasswordForm;
