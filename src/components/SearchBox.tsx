'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function SearchBox({ initial = '' }: { initial?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initial);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const q = value.trim();
        if (q.length > 0) {
          router.push(`/search?q=${encodeURIComponent(q)}`);
        }
      }}
      className="relative w-full max-w-xs"
    >
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search monsters, items…"
        className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-1.5 text-sm text-white placeholder:text-white/35 focus:border-accent focus:outline-none"
        aria-label="Search the database"
      />
    </form>
  );
}
