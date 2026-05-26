import { useState, useEffect, useCallback } from "react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

const DISMISS_KEY = "pwa-banner-dismissed"
const DISMISS_DAYS = 7

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [showIOSModal, setShowIOSModal] = useState(false)
  const [bannerDismissed, setBannerDismissed] = useState(false)

  useEffect(() => {
    // Check if already running as installed PWA
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true
    setIsInstalled(isStandalone)

    // Detect iOS devices
    const iosCheck =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as unknown as { MSStream?: unknown }).MSStream
    setIsIOS(iosCheck)

    // Check if banner was recently dismissed
    const dismissed = localStorage.getItem(DISMISS_KEY)
    if (dismissed) {
      const diffDays =
        (Date.now() - new Date(dismissed).getTime()) / (1000 * 60 * 60 * 24)
      if (diffDays < DISMISS_DAYS) {
        setBannerDismissed(true)
      } else {
        localStorage.removeItem(DISMISS_KEY)
      }
    }

    // Intercept the browser's install prompt
    const onBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    const onAppInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstall)
    window.addEventListener("appinstalled", onAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall)
      window.removeEventListener("appinstalled", onAppInstalled)
    }
  }, [])

  const installApp = useCallback(async () => {
    if (isIOS) {
      setShowIOSModal(true)
      return
    }

    if (deferredPrompt) {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === "accepted") {
        setIsInstalled(true)
      }
      setDeferredPrompt(null)
    }
  }, [isIOS, deferredPrompt])

  const dismissBanner = useCallback(() => {
    setBannerDismissed(true)
    localStorage.setItem(DISMISS_KEY, new Date().toISOString())
  }, [])

  const canInstall = !isInstalled && (!!deferredPrompt || isIOS)
  const showBanner = canInstall && !bannerDismissed

  return {
    canInstall,
    isInstalled,
    isIOS,
    showBanner,
    showIOSModal,
    setShowIOSModal,
    installApp,
    dismissBanner,
  }
}
