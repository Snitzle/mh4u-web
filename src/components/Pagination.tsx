import Link from 'next/link';

interface Props {
  basePath: string;
  query: Record<string, string | undefined>;
  currentPage: number;
  lastPage: number;
  total: number;
}

function buildHref(basePath: string, query: Record<string, string | undefined>, page: number): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== '' && key !== 'page') {
      params.set(key, value);
    }
  }
  if (page > 1) params.set('page', String(page));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function Pagination({ basePath, query, currentPage, lastPage, total }: Props) {
  if (lastPage <= 1) {
    return <p className="mt-6 text-center text-xs text-white/40">{total} results</p>;
  }

  const linkClass =
    'rounded-md border border-white/15 px-3 py-1.5 text-sm text-white/80 transition hover:border-accent/50 hover:text-white';
  const disabledClass = 'pointer-events-none rounded-md border border-white/5 px-3 py-1.5 text-sm text-white/25';

  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      {currentPage > 1 ? (
        <Link href={buildHref(basePath, query, currentPage - 1)} className={linkClass}>
          ← Prev
        </Link>
      ) : (
        <span className={disabledClass}>← Prev</span>
      )}

      <span className="text-sm text-white/50">
        Page {currentPage} of {lastPage} · {total} total
      </span>

      {currentPage < lastPage ? (
        <Link href={buildHref(basePath, query, currentPage + 1)} className={linkClass}>
          Next →
        </Link>
      ) : (
        <span className={disabledClass}>Next →</span>
      )}
    </div>
  );
}
