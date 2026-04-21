import clsx from 'clsx';
import { motion } from 'framer-motion';

export default function Card({ children, className, hover = true }) {
  return (
    <motion.div
      whileHover={hover ? { y: -6, scale: 1.01 } : undefined}
      className={clsx('glass-panel p-6 transition-shadow', className)}
    >
      {children}
    </motion.div>
  );
}
