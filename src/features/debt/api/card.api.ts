import { API_URL } from "@/config/api.config";
import { cardSchema, type Card, type CardWithSummary } from "../types";

export const createCard = async (data: Omit<Card, "id">) => {
  const parsed = cardSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Datos de tarjeta inválidos");
  }

  try{
    const response = await fetch(`${API_URL}/accounts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
      credentials: "include"
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al crear la tarjeta");
    }
    return response.json();
  } catch (error) {
    console.error("Error creating card:", error);
    throw new Error("Error al crear la tarjeta");
  }
}

export const fetchCards = async (): Promise<CardWithSummary[]> => {
  try {
    const response = await fetch(`${API_URL}/accounts`, {
      method: "GET",
      credentials: "include"
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener las tarjetas");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching cards:", error);
    throw new Error("Error al obtener las tarjetas");
  }
}

export const payCard = async (cardId: string) => {
  try {
    const response = await fetch(`${API_URL}/accounts/${cardId}/pay`, {
      method: "POST",
      credentials: "include"
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al procesar el pago");
    }
    return response.json();
  } catch (error: any) {
    console.error("Error paying card:", error);
    throw new Error(error.message || "Error al procesar el pago");
  }
}
