import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

export function Card({ href, children }: { href?: string; children: ReactNode }) {
  const className =
    'group block rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-accent/50 hover:bg-white/[0.06]';

  return href ? (
    <Link href={href} className={className}>
      {children}
    </Link>
  ) : (
    <div className={className}>{children}</div>
  );
}

export function Icon({ src, alt, size = 44 }: { src: string | null; alt: string; size?: number }) {
  if (!src) {
    return (
      <div
        className="flex shrink-0 items-center justify-center rounded-md bg-white/5 text-xs text-white/30"
        style={{ width: size, height: size }}
      >
        ?
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="shrink-0 rounded-md object-contain"
      unoptimized
    />
  );
}

const RARITY_COLORS = [
  '#9ca3af', '#d1d5db', '#86efac', '#67e8f9', '#93c5fd',
  '#c4b5fd', '#f0abfc', '#fda4af', '#fdba74', '#fcd34d', '#fca5a5',
];

export function RarityBadge({ rarity }: { rarity: number | null }) {
  if (rarity === null) return null;
  const color = RARITY_COLORS[Math.min(rarity, RARITY_COLORS.length - 1)] ?? '#9ca3af';

  return (
    <span
      className="rounded px-1.5 py-0.5 text-[11px] font-semibold"
      style={{ backgroundColor: `${color}22`, color }}
    >
      Rare {rarity}
    </span>
  );
}

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-white/15 px-2.5 py-0.5 text-xs text-white/70">
      {children}
    </span>
  );
}

export function PageHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-white/50">{subtitle}</p>}
    </div>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">{title}</h2>
      {children}
    </section>
  );
}

export function StatTile({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
      <div className="text-[11px] uppercase tracking-wide text-white/40">{label}</div>
      <div className="text-lg font-semibold text-white">{value}</div>
    </div>
  );
}
