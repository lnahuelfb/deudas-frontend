export const requestPasswordReset = async (email: string) => {
  const res = await fetch("http://localhost:3000/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error al solicitar el restablecimiento");
  }

  return res.json();
};

export const resetPassword = async (token: string, newPassword: string) => {
  const res = await fetch("http://localhost:3000/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error al restablecer la contraseña");
  }

  return res.json();
};
