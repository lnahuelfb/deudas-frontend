import { useQuery } from "@tanstack/react-query"

export const useSession = () => {
  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/api/auth/me", {
        credentials: "include"
      })
      
      if (!res.ok) throw new Error("Not authenticated")
      return res.json()
    }
  })
}