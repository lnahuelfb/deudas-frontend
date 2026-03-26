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
