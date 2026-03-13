import { useQuery } from "@tanstack/react-query"
import { getCards } from "../api/cards.api"

export function useCards() {
  return useQuery({
    queryKey: ["cards"],
    queryFn: getCards
  })
}