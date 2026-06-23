import type { Metadata } from "next";
import Link from "next/link";
import { api } from "@/lib/api/client";
import type { SearchHit } from "@/lib/api/types";
import { Icon, PageHeading } from "@/components/ui";
import { SearchBox } from "@/components/SearchBox";

export const metadata: Metadata = { title: "Search" };

const GROUP_LABELS: Record<string, string> = {
  monsters: "Monsters",
  weapons: "Weapons",
  armor: "Armor",
  decorations: "Decorations",
  items: "Items",
  quests: "Quests",
  locations: "Locations",
  skill_trees: "Skill Trees",
};

const WEB_PATHS: Record<string, string> = {
  monster: "/monsters",
  weapon: "/weapons",
  armor: "/armor",
  decoration: "/items",
  item: "/items",
  quest: "/quests",
};

function hrefFor(hit: SearchHit): string | null {
  const base = WEB_PATHS[hit.type];
  return base ? `${base}/${hit.id}` : null;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  if (query.length === 0) {
    return (
      <div>
        <PageHeading title="Search" subtitle="Find monsters, weapons, armor, items and quests" />
        <SearchBox />
      </div>
    );
  }

  const results = await api.search(query);
  const groups = Object.entries(results.data).filter(([, hits]) => hits.length > 0);
  const totalHits = groups.reduce((sum, [, hits]) => sum + hits.length, 0);

  return (
    <div>
      <PageHeading title={`Search: “${query}”`} subtitle={`${totalHits} results`} />

      {groups.length === 0 ? (
        <p className="text-white/50">No results. Try a different term.</p>
      ) : (
        <div className="space-y-8">
          {groups.map(([group, hits]) => (
            <section key={group}>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">
                {GROUP_LABELS[group] ?? group}
              </h2>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {hits.map((hit) => {
                  const href = hrefFor(hit);
                  const inner = (
                    <div className="flex items-center gap-3">
                      <Icon src={hit.icon_url} alt={hit.name} size={36} />
                      <span className="truncate text-sm font-medium text-white">{hit.name}</span>
                    </div>
                  );
                  return href ? (
                    <Link
                      key={`${hit.type}-${hit.id}`}
                      href={href}
                      className="rounded-lg border border-white/10 bg-white/[0.03] p-3 transition hover:border-accent/50 hover:bg-white/[0.06] [&_span]:hover:text-accent"
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div key={`${hit.type}-${hit.id}`} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                      {inner}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
