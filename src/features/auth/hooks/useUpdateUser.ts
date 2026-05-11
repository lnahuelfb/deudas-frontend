import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile } from "../api/user.api";
import { toast } from "sonner";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      toast.success("Perfil actualizado correctamente");
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al actualizar perfil");
    }
  });
};
