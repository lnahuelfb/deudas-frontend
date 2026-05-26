import { useEffect } from "react"

export function usePWADebug() {
  useEffect(() => {
    // Log PWA readiness
    const checks = {
      isHTTPS: window.location.protocol === "https:",
      hasServiceWorker: "serviceWorker" in navigator,
      hasManifest: !!document.querySelector('link[rel="manifest"]'),
      userAgent: navigator.userAgent,
    }

    console.log("🔍 PWA Checks:", checks)

    // Check manifest validity
    fetch("/manifest.webmanifest")
      .then((r) => r.json())
      .then((manifest) => {
        console.log("✅ Manifest válido:", manifest)
        validateManifest(manifest)
      })
      .catch((e) => console.error("❌ Manifest inválido:", e))

    // Listen for beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      console.log("🎉 beforeinstallprompt DISPARADO!")
      e.preventDefault()
    }

    const handleAppInstalled = () => {
      console.log("✅ App instalada!")
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstall)
    window.addEventListener("appinstalled", handleAppInstalled)

    // Check SW registration
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        if (registrations.length > 0) {
          console.log("✅ Service Worker activo:", registrations[0])
        } else {
          console.warn("⚠️ No hay Service Worker registrado")
        }
      })
      .catch((e) => console.error("❌ Error con SW:", e))

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])
}

function validateManifest(manifest: any) {
  const issues: string[] = []

  if (!manifest.name) issues.push("❌ Falta 'name'")
  if (!manifest.short_name) issues.push("❌ Falta 'short_name'")
  if (!manifest.start_url) issues.push("❌ Falta 'start_url'")
  if (!manifest.display) issues.push("❌ Falta 'display'")
  if (manifest.display !== "standalone")
    issues.push("❌ display no es 'standalone'")
  if (!manifest.icons || manifest.icons.length === 0)
    issues.push("❌ Falta icons")
  if (
    !manifest.icons.some(
      (i: any) =>
        i.sizes === "192x192" || i.sizes.includes("192") || i.sizes === "any"
    )
  )
    issues.push("❌ Falta icon de 192x192")
  if (
    !manifest.icons.some(
      (i: any) =>
        i.sizes === "512x512" || i.sizes.includes("512") || i.sizes === "any"
    )
  )
    issues.push("❌ Falta icon de 512x512")
  if (!manifest.theme_color) issues.push("⚠️ Falta 'theme_color'")
  if (!manifest.background_color) issues.push("⚠️ Falta 'background_color'")

  if (issues.length === 0) {
    console.log("✅ Manifest válido con todos los criterios")
  } else {
    console.warn("Problemas en manifest:", issues)
  }
}
