import { API_URL } from "@/config/api.config"
import { useQuery } from "@tanstack/react-query"

export const useSession = () => {
  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/auth/me`, {
        credentials: "include"
      })
      
      if (!res.ok) throw new Error("Not authenticated")
      return res.json()
    }
  })
}