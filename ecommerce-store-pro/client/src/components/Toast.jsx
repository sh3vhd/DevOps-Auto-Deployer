import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { dismissToast } from '../store/slices/uiSlice';
import Button from './Button';

const toastVariants = {
  info: 'border-white/20 text-white',
  success: 'border-accent/60 text-accent',
  danger: 'border-red-400/60 text-red-200'
};

export default function ToastStack({ toasts }) {
  const dispatch = useDispatch();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex w-80 flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            className={`glass-panel border ${toastVariants[toast.type] || toastVariants.info}`}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-sm font-semibold">{toast.title}</h4>
                <p className="text-xs text-white/70">{toast.message}</p>
              </div>
              <Button
                variant="ghost"
                className="px-2 py-1"
                onClick={() => dispatch(dismissToast(toast.id))}
                aria-label="Dismiss notification"
              >
                ✕
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
