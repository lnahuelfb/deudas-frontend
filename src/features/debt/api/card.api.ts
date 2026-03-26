import { cardSchema, type Card } from "../types";

export const createCard = async (data: Omit<Card, "id">) => {
  const parsed = cardSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Datos de tarjeta inválidos");
  }

  try{
    const response = await fetch("http://localhost:3000/api/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
      credentials: "include"
    });

    console.log("Create card response:", response);

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

export const fetchCards = async (): Promise<Card[]> => {
  try {
    const response = await fetch("http://localhost:3000/api/accounts", {
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


