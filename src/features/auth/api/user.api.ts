import { API_URL } from "@/config/api.config";

export const updateUserProfile = async (data: { name?: string; monthlySpendingLimit?: number; password?: string }) => {
  const response = await fetch(`${API_URL}/users/me`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include"
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error al actualizar el perfil");
  }

  return response.json();
};
