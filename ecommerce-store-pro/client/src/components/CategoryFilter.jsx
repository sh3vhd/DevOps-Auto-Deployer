import clsx from 'clsx';

export default function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange(null)}
        className={clsx(
          'focus-ring rounded-full px-4 py-2 text-sm transition-colors',
          active === null ? 'bg-neon/80 text-base font-semibold' : 'bg-white/10 text-white/70'
        )}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onChange(category.slug)}
          className={clsx(
            'focus-ring rounded-full px-4 py-2 text-sm transition-colors',
            active === category.slug
              ? 'bg-accent/80 text-base font-semibold'
              : 'bg-white/10 text-white/70'
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
