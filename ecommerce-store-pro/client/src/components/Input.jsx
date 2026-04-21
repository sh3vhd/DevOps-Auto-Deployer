import clsx from 'clsx';

export default function Input({ label, helperText, className, ...props }) {
  return (
    <label className="block text-sm">
      {label && <span className="mb-1 inline-block text-sm font-medium text-white/80">{label}</span>}
      <input
        className={clsx(
          'focus-ring w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40',
          className
        )}
        {...props}
      />
      {helperText && <p className="mt-1 text-xs text-white/60">{helperText}</p>}
    </label>
  );
}
