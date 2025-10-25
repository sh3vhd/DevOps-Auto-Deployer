import Button from './Button';

export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;

  const next = () => onPageChange(page + 1);
  const prev = () => onPageChange(page - 1);

  return (
    <div className="mt-8 flex items-center justify-center gap-4 text-white/70">
      <Button variant="ghost" disabled={page <= 1} onClick={prev}>
        Previous
      </Button>
      <span className="text-sm">
        Page <strong>{page}</strong> of <strong>{pages}</strong>
      </span>
      <Button variant="ghost" disabled={page >= pages} onClick={next}>
        Next
      </Button>
    </div>
  );
}
