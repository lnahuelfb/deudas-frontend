import { useState, useEffect } from 'react';
import { fetchCards, createCard } from '../api/card.api';
import type { Card } from '../types';

export const useCards = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cards, setCards] = useState<Card[]>([]);

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

export const useAddCard = async () => {
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