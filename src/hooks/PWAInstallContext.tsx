import { createContext, useContext, type ReactNode } from "react"
import { usePWAInstall } from "@/hooks/usePWAInstall"

type PWAInstallContextType = ReturnType<typeof usePWAInstall>

const PWAInstallContext = createContext<PWAInstallContextType | null>(null)

export function PWAInstallProvider({ children }: { children: ReactNode }) {
  const value = usePWAInstall()
  return (
    <PWAInstallContext.Provider value={value}>
      {children}
    </PWAInstallContext.Provider>
  )
}

export function usePWAInstallContext() {
  const ctx = useContext(PWAInstallContext)
  if (!ctx) {
    throw new Error("usePWAInstallContext must be used within PWAInstallProvider")
  }
  return ctx
}
