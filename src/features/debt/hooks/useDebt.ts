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
    onMutate: async (deletedDebtId) => {
      // 1. Cancelar cualquier petición en vuelo para que no pise nuestra actualización optimista
      await queryClient.cancelQueries({ queryKey: ["debts"] });
      await queryClient.cancelQueries({ queryKey: ["all-debts"] });

      // 2. Guardar el estado anterior por si tenemos que revertir (Rollback)
      const previousDebts = queryClient.getQueriesData({ queryKey: ["debts"] });
      const previousAllDebts = queryClient.getQueryData(["all-debts"]);

      // 3. Borrar el ítem de la vista al instante (Optimistic Update)
      queryClient.setQueriesData({ queryKey: ["debts"] }, (old: any) => {
        if (Array.isArray(old)) return old.filter((debt: any) => debt.id !== deletedDebtId);
        return old;
      });
      
      queryClient.setQueryData(["all-debts"], (old: any) => {
        if (Array.isArray(old)) return old.filter((debt: any) => debt.id !== deletedDebtId);
        return old;
      });

      // Retornar el estado previo para usarlo en onError
      return { previousDebts, previousAllDebts };
    },
    onError: (err: any, _, context: any) => {
      // 4. ¡Falló! Revertimos a como estaba antes
      if (context?.previousDebts) {
        context.previousDebts.forEach(([queryKey, data]: any) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousAllDebts) {
        queryClient.setQueryData(["all-debts"], context.previousAllDebts);
      }
      toast.error(err.message || "Error al eliminar la deuda");
    },
    onSuccess: () => {
      toast.success("Deuda eliminada correctamente");
    },
    onSettled: () => {
      // 5. Independientemente de si falló o no, sincronizamos con la base de datos real
      queryClient.invalidateQueries({ queryKey: ["debts"] });
      queryClient.invalidateQueries({ queryKey: ["all-debts"] });
      queryClient.invalidateQueries({ queryKey: ["cards"] });
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
