import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createDebt, fetchDebts, getAllDebts, updateDebt, deleteDebt } from "../api/debt.api";
import { toast } from "sonner";
import type { Debt } from "../types";

export const useDebt = (cardId?: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["debts", cardId],
    queryFn: () => fetchDebts(cardId!),
    enabled: !!cardId,
    staleTime: 1000 * 60 * 5,
  });

  return { 
    debts: data || [], 
    loading: isLoading, 
    error: error instanceof Error ? error.message : null, 
    fetchUserDebts: refetch 
  };
};

export const useGetAllDebts = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["all-debts"],
    queryFn: getAllDebts,
    staleTime: 1000 * 60 * 5,
  });

  return { 
    data: data || null, 
    loading: isLoading, 
    error: error instanceof Error ? error.message : null, 
    getDebts: refetch 
  };
};

export const useAddDebt = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: addDebt, isPending, error } = useMutation({
    mutationFn: (data: Debt) => {
      const { id, ...rest } = data;
      return createDebt(rest as any);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["debts", variables.accountId] });
      queryClient.invalidateQueries({ queryKey: ["all-debts"] });
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      toast.success("Gasto agregado correctamente");
    },
    onError: (err: any) => {
      toast.error(err.message || "Error al crear la deuda");
    }
  });

  return { addDebt, loading: isPending, error: error instanceof Error ? error.message : null };
};

export const useDeleteDebt = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: doDeleteDebt, isPending, error } = useMutation({
    mutationFn: deleteDebt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["debts"] });
      queryClient.invalidateQueries({ queryKey: ["all-debts"] });
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      toast.success("Deuda eliminada correctamente");
    },
    onError: (err: any) => {
      toast.error(err.message || "Error al eliminar la deuda");
    }
  });

  return { deleteDebt: doDeleteDebt, loading: isPending, error: error instanceof Error ? error.message : null };
};

export const useUpdateDebt = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: doUpdateDebt, isPending, error } = useMutation({
    mutationFn: ({ debtId, data }: { debtId: string, data: Partial<Omit<Debt, "id" | "createdAt" | "updatedAt">> }) => 
      updateDebt(debtId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["debts"] });
      queryClient.invalidateQueries({ queryKey: ["all-debts"] });
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      toast.success("Deuda actualizada correctamente");
    },
    onError: (err: any) => {
      toast.error(err.message || "Error al actualizar la deuda");
    }
  });

  return { 
    updateDebt: (debtId: string, data: any) => doUpdateDebt({ debtId, data }), 
    loading: isPending, 
    error: error instanceof Error ? error.message : null 
  };
};
