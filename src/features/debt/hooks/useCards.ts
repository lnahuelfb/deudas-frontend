import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCards, createCard, payCard } from '../api/card.api';
import { toast } from 'sonner';


export const useCards = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['cards'],
    queryFn: fetchCards,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  return { 
    cards: data || [], 
    loading: isLoading, 
    error: error instanceof Error ? error.message : null, 
    fetchUserCards: refetch 
  };
};

export const useAddCard = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: addCard, isPending, error } = useMutation({
    mutationFn: createCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      toast.success("Tarjeta creada correctamente");
    },
    onError: (err: any) => {
      toast.error(err.message || "Error al crear la tarjeta");
    }
  });

  return { 
    addCard, 
    loading: isPending, 
    error: error instanceof Error ? error.message : null 
  };
};

export const usePayCard = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: doPayCard, isPending, error } = useMutation({
    mutationFn: payCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      queryClient.invalidateQueries({ queryKey: ['all-debts'] });
      toast.success("Pago registrado correctamente");
    },
    onError: (err: any) => {
      toast.error(err.message || "Error al procesar el pago");
    }
  });

  return { 
    doPayCard, 
    loading: isPending, 
    error: error instanceof Error ? error.message : null 
  };
};