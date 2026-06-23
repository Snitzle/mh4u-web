'use client';

import { useRouter } from 'next/navigation';
import type { FilterOption } from './Filters';
import { queryHref } from '@/lib/url';

interface Props {
  label: string;
  param: string;
  value?: string;
  options: FilterOption[];
  placeholder: string;
  basePath: string;
  query: Record<string, string | undefined>;
}

/** A select that navigates (preserving other params) when its value changes. */
export function NavSelect({ label, param, value, options, placeholder, basePath, query }: Props) {
  const router = useRouter();

  return (
    <label className="flex items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-white/40">{label}</span>
      <select
        value={value ?? ''}
        onChange={(event) =>
          router.push(queryHref(basePath, { ...query, [param]: event.target.value || undefined, page: undefined }))
        }
        className="rounded-lg border border-white/15 bg-black/30 px-2.5 py-1 text-sm text-white focus:border-accent focus:outline-none"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
