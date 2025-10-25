import { motion } from 'framer-motion';
import clsx from 'clsx';

const baseClasses =
  'relative inline-flex items-center justify-center px-5 py-2.5 font-semibold rounded-full focus-ring transition-colors';

const variants = {
  primary: 'bg-neon/80 hover:bg-neon text-[#0f1115] shadow-neon',
  secondary: 'bg-accent/80 hover:bg-accent text-[#0f1115] shadow-accent',
  ghost: 'bg-transparent border border-white/20 hover:border-neon/60 text-white'
};

export default function Button({
  as: Component = 'button',
  children,
  variant = 'primary',
  className,
  icon: Icon,
  iconPosition = 'left',
  ...props
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Component className={clsx(baseClasses, variants[variant], className)} {...props}>
        {Icon && iconPosition === 'left' && <Icon className="mr-2 h-5 w-5" />}
        <span>{children}</span>
        {Icon && iconPosition === 'right' && <Icon className="ml-2 h-5 w-5" />}
      </Component>
    </motion.div>
  );
}
