import { API_URL } from "@/config/api.config";
import { debtSchema, type Debt } from "../types";

export const createDebt = async (data: Debt) => {
  const parsed = debtSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Datos de deuda inválidos", { cause: parsed.error });
  }

  try {
    const response = await fetch(`${API_URL}/debts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
      credentials: "include"
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al crear la deuda");
    }
    return response.json();
  } catch (error) {
    throw new Error("Error al crear la deuda", { cause: error });
  }
}

export const fetchDebts = async (cardId?: string): Promise<Debt[]> => {
  try {
    const url = cardId ? `${API_URL}/debts?accountId=${cardId}` : `${API_URL}/debts`;
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
    throw new Error("Error al obtener las deudas", { cause: error });
  }
}

export const getAllDebts = async () => {
  try {
    const response = await fetch(`${API_URL}/debts/all`, {
      method: "GET",
      credentials: "include"
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Error al obtener las deudas")
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching debts:", error);
    throw new Error("Error al obtener las deudas", { cause: error });
  }
}

export const deleteDebtByAccount = async (accountId: string) => {
  const response = await fetch(`${API_URL}/debts/account/${accountId}`, {
      method: "DELETE",
      credentials: "include"
    });

    if (!response.ok) {
      const errorData = response.status !== 204 ? await response.json() : {};
      throw new Error(errorData.message || "Error al eliminar la deuda", { cause: errorData });
    }

    if (response.status === 204) return true;

    return response.json();
}

export const deleteDebt = async (debtId: string) => {
  try {
    const response = await fetch(`${API_URL}/debts/${debtId}`, {
      method: "DELETE",
      credentials: "include"
    });

    if (!response.ok) {
      const errorData = response.status !== 204 ? await response.json() : {};
      throw new Error(errorData.message || "Error al eliminar la deuda", { cause: errorData });
    }

    if (response.status === 204) return true;

    return response.json();
  } catch (error) {
    console.error("Error deleting debt:", error);
    throw new Error("Error al eliminar la deuda", { cause: error });
  }
}

export const updateDebt = async (debtId: string, data: Partial<Omit<Debt, "id">>) => {
  try {
    const response = await fetch(`${API_URL}/debts/${debtId}`, {
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
    throw new Error("Error al actualizar la deuda", { cause: error });
  }
}

