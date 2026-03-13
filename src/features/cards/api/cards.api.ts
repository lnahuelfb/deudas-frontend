import type { Card } from "../types"

export async function getCards(): Promise<Card[]> {
  const res = await fetch("/api/cards")

  if (!res.ok) {
    throw new Error("Failed to fetch cards")
  }

  return res.json()
}