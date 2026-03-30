import {debtSchema, type Debt} from "../types";

export const createDebt = async (data: Omit<Debt, "id">) => {
  const parsed = debtSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Datos de deuda inválidos");
  }

  try{
    const response = await fetch("http://localhost:3000/api/debts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
      credentials: "include"
    });

    console.log("Create debt response:", response);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al crear la deuda");
    }
    return response.json();
  } catch (error) {
    console.error("Error creating debt:", error);
    throw new Error("Error al crear la deuda");
  }
}

export const fetchDebts = async (cardId?: string): Promise<Debt[]> => {
  try {
    const url = cardId ? `http://localhost:3000/api/debts?accountId=${cardId}` : "http://localhost:3000/api/debts";
    const response = await fetch(url, {
      method: "GET",
      credentials: "include"
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener las deudas");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching debts:", error);
    throw new Error("Error al obtener las deudas");
  }
}

export const deleteDebt = async (debtId: string) => {
  try {
    const response = await fetch(`http://localhost:3000/api/debts/${debtId}`, {
      method: "DELETE",
      credentials: "include"
    });

    if (!response.ok) {
      const errorData = response.status !== 204 ? await response.json() : {};
      throw new Error(errorData.message || "Error al eliminar la deuda");
    }

    if (response.status === 204) return true;
    
    return response.json();
  } catch (error) {
    console.error("Error deleting debt:", error);
    throw error; // Re-lanzamos el error original para que el hook lo vea
  }
}

export const updateDebt = async (debtId: string, data: Partial<Omit<Debt, "id">>) => {
  try {
    const response = await fetch(`http://localhost:3000/api/debts/${debtId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include"
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al actualizar la deuda");
    }

    return response.json();
  } catch (error) {
    console.error("Error updating debt:", error);
    throw new Error("Error al actualizar la deuda");
  }
}
