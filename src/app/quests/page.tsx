import type { Metadata } from "next";
import { api } from "@/lib/api/client";
import { Card, PageHeading } from "@/components/ui";
import { FilterChips } from "@/components/Filters";
import { NavSelect } from "@/components/NavSelect";
import { Pagination } from "@/components/Pagination";
import { STAR_OPTIONS } from "@/lib/url";

export const metadata: Metadata = { title: "Quests" };

const HUBS = ["Caravan", "Guild", "Event"].map((hub) => ({ value: hub, label: hub }));

export default async function QuestsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; hub?: string; stars?: string; monster?: string }>;
}) {
  const { page, hub, stars, monster } = await searchParams;

  const [quests, monsters] = await Promise.all([
    api.quests({
      page,
      per_page: 40,
      "filter[hub]": hub,
      "filter[stars]": stars,
      "filter[monster]": monster,
    }),
    api.monsters({ per_page: 200 }),
  ]);

  const monsterOptions = monsters.data.map((m) => ({ value: String(m.id), label: m.name }));
  const query = { hub, stars, monster };

  return (
    <div>
      <PageHeading title="Quests" subtitle={`${quests.meta.total} quests`} />

      <div className="mb-6 space-y-3">
        <FilterChips label="Hub" param="hub" options={HUBS} active={hub} basePath="/quests" query={query} />
        <FilterChips label="Rank" param="stars" options={STAR_OPTIONS} active={stars} basePath="/quests" query={query} />
        <NavSelect
          label="Monster"
          param="monster"
          value={monster}
          options={monsterOptions}
          placeholder="Any monster"
          basePath="/quests"
          query={query}
        />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {quests.data.map((quest) => (
          <Card key={quest.id} href={`/quests/${quest.id}`}>
            <div className="font-medium text-white group-hover:text-accent">{quest.name}</div>
            <div className="mt-1 flex items-center gap-2 text-xs text-white/45">
              <span className="text-accent">{"★".repeat(quest.stars)}</span>
              <span>{quest.hub}</span>
              <span>·</span>
              <span>{quest.type}</span>
            </div>
          </Card>
        ))}
      </div>

      <Pagination
        basePath="/quests"
        query={{ page, hub, stars, monster }}
        currentPage={quests.meta.current_page}
        lastPage={quests.meta.last_page}
        total={quests.meta.total}
      />
    </div>
  );
}
