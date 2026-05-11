import { useState, useEffect } from 'react';
import { fetchCards, createCard, payCard } from '../api/card.api';
import type { Card, CardWithSummary } from '../types';

export const useCards = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cards, setCards] = useState<CardWithSummary[]>([]);

  const fetchUserCards = async () => {
    setLoading(true);
    try {
      const data = await fetchCards();
      setCards(data || []);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCards();
  }, []);

  return { cards, loading, error, fetchUserCards };
};

export const useAddCard = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addCard = async (data: Omit<Card, "id">) => {
    setLoading(true)
    setError(null)
    try {
      const newCard = await createCard(data)
      setLoading(false)
      return newCard
    } catch (err: any) {
      setError(err.message || "Error desconocido")
      setLoading(false)
      return null
    }
  }

  return { addCard, loading, error }
}

export const usePayCard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const doPayCard = async (cardId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await payCard(cardId);
      setLoading(false);
      return result;
    } catch (err: any) {
      setError(err.message || "Error al procesar el pago");
      setLoading(false);
      throw err;
    }
  };

  return { doPayCard, loading, error };
};