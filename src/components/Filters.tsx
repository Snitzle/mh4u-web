import Link from 'next/link';
import { queryHref } from '@/lib/url';

export interface FilterOption {
  value: string;
  label: string;
}

interface ChipsProps {
  label: string;
  param: string;
  options: FilterOption[];
  active?: string;
  basePath: string;
  query: Record<string, string | undefined>;
}

const baseChip = 'rounded-full px-3 py-1 text-xs transition whitespace-nowrap';
const activeChip = 'bg-accent text-black font-medium';
const idleChip = 'border border-white/15 text-white/70 hover:text-white';

/** A horizontal row of filter chips that preserves the other query params. */
export function FilterChips({ label, param, options, active, basePath, query }: ChipsProps) {
  const href = (value?: string) => queryHref(basePath, { ...query, [param]: value, page: undefined });

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-white/40">{label}</span>
      <Link href={href(undefined)} className={`${baseChip} ${!active ? activeChip : idleChip}`}>
        All
      </Link>
      {options.map((option) => (
        <Link
          key={option.value}
          href={href(option.value)}
          className={`${baseChip} ${active === option.value ? activeChip : idleChip}`}
        >
          {option.label}
        </Link>
      ))}
    </div>
  );
}
