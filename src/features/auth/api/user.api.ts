export const updateUserProfile = async (data: { name?: string; monthlySpendingLimit?: number }) => {
  const response = await fetch("http://localhost:3000/api/users/me", {
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
