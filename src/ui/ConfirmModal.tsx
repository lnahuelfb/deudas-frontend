import { motion, AnimatePresence } from 'framer-motion';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'primary'
}: ConfirmModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0f172a]/90" // Color sólido con alta opacidad para foco total y 0 lag
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-sm bg-[#4c1d95] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className={`p-4 rounded-2xl ${variant === 'danger' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                <ExclamationTriangleIcon className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-white text-xl font-black tracking-tight">{title}</h3>
                <p className="text-violet-200/60 text-sm font-semibold leading-relaxed">
                  {description}
                </p>
              </div>

              <div className="flex flex-col w-full gap-3 pt-4">
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`w-full p-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-lg ${
                    variant === 'danger' 
                      ? 'bg-red-500 hover:bg-red-400 text-white shadow-red-500/20' 
                      : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/20'
                  }`}
                >
                  {confirmText}
                </button>
                <button
                  onClick={onClose}
                  className="w-full p-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                >
                  {cancelText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
