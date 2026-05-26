import { AnimatePresence, motion } from "framer-motion"
import { XMarkIcon, ArrowDownTrayIcon, ShareIcon, PlusIcon, CheckIcon } from "@heroicons/react/24/outline"
import { usePWAInstallContext } from "@/hooks/PWAInstallContext"

/* ───────────────────────────────── Banner ───────────────────────────────── */

export function InstallBanner() {
  const { showBanner, installApp, dismissBanner } = usePWAInstallContext()

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-lg"
        >
          <div className="relative flex items-center gap-4 rounded-2xl border border-white/10 bg-violet-900/80 px-5 py-4 shadow-2xl shadow-violet-950/60 backdrop-blur-xl">
            {/* App icon */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-indigo-500 shadow-lg">
              <span className="text-lg font-black italic text-white">C</span>
            </div>

            {/* Text */}
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-white">Instalá CuentasClaras</p>
              <p className="text-sm text-violet-300">
                Acceso rápido desde tu pantalla de inicio
              </p>
            </div>

            {/* Install button */}
            <button
              type="button"
              onClick={installApp}
              className="flex shrink-0 items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              Instalar
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={dismissBanner}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-violet-800 text-violet-300 shadow-md transition-colors hover:bg-violet-700 hover:text-white"
              aria-label="Cerrar"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ──────────────────────────── Botón para el menú ────────────────────────── */

export function InstallMenuItem({ className, onClick }: { className?: string; onClick?: () => void }) {
  const { canInstall, installApp } = usePWAInstallContext()

  if (!canInstall) return null

  const handleClick = () => {
    installApp()
    onClick?.()
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
      Instalar App
    </button>
  )
}

/* ─────────────────────────── Modal iOS ──────────────────────────────────── */

export function IOSInstallModal() {
  const { showIOSModal, setShowIOSModal } = usePWAInstallContext()

  const steps = [
    {
      icon: <ShareIcon className="h-7 w-7 text-violet-300" />,
      title: "Tocá el botón \"Compartir\"",
      description: "El ícono con la flecha hacia arriba en la barra de Safari",
    },
    {
      icon: <PlusIcon className="h-7 w-7 text-violet-300" />,
      title: "Seleccioná \"Agregar a inicio\"",
      description: "Buscalo en la lista de opciones que aparece",
    },
    {
      icon: <CheckIcon className="h-7 w-7 text-violet-300" />,
      title: "Tocá \"Agregar\" para confirmar",
      description: "¡Listo! CuentasClaras va a aparecer en tu pantalla de inicio",
    },
  ]

  return (
    <AnimatePresence>
      {showIOSModal && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowIOSModal(false)}
          />

          {/* Bottom sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg"
          >
            <div className="rounded-t-3xl border-t border-white/10 bg-violet-950/95 px-6 pb-8 pt-4 shadow-2xl backdrop-blur-xl">
              {/* Drag handle */}
              <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-violet-700" />

              {/* Title */}
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-indigo-500 shadow-lg">
                  <span className="text-sm font-black italic text-white">C</span>
                </div>
                <h2 className="text-xl font-bold text-white">
                  Instalá CuentasClaras
                </h2>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                {steps.map((step, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 rounded-2xl border border-white/5 bg-violet-900/40 px-4 py-4"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-800/60">
                      {step.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-white">
                        <span className="mr-1.5 text-violet-400">{i + 1}.</span>
                        {step.title}
                      </p>
                      <p className="mt-0.5 text-sm text-violet-300">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="mt-6 w-full rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 py-3 text-center font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Entendido
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
