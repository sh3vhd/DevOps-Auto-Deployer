import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function Loader({ fullscreen = false, label = 'Loading...' }) {
  return (
    <div
      className={clsx(
        'flex items-center justify-center gap-3 text-white',
        fullscreen ? 'fixed inset-0 z-40 bg-base/80 backdrop-blur-sm' : ''
      )}
    >
      <motion.div
        className="h-10 w-10 rounded-full border-2 border-neon/50 border-t-neon"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, ease: 'linear', duration: 1 }}
      />
      <span className="text-sm font-medium uppercase tracking-[0.2em] text-white/80">
        {label}
      </span>
    </div>
  );
}
