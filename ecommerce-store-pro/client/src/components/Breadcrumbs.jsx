import { Link } from 'react-router-dom';

export default function Breadcrumbs({ items }) {
  if (!items?.length) return null;

  return (
    <nav className="flex items-center gap-2 text-xs text-white/60" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <span key={item.to} className="flex items-center gap-2">
          {index > 0 && <span className="text-white/40">/</span>}
          {item.to ? (
            <Link to={item.to} className="hover:text-neon focus-ring rounded">
              {item.label}
            </Link>
          ) : (
            <span className="text-white">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
