import clsx from 'clsx';

const variants = {
  default: 'bg-white/10 text-white',
  success: 'bg-accent/30 text-accent',
  warning: 'bg-yellow-300/20 text-yellow-200',
  danger: 'bg-red-400/20 text-red-200'
};

export default function Badge({ children, variant = 'default', className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
