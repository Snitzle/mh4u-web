import type { Metadata } from "next";
import { api } from "@/lib/api/client";
import { Card, Icon, PageHeading } from "@/components/ui";
import { Pagination } from "@/components/Pagination";

export const metadata: Metadata = { title: "Monsters" };

export default async function MonstersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const monsters = await api.monsters({ page, per_page: 48 });

  return (
    <div>
      <PageHeading title="Monsters" subtitle={`${monsters.meta.total} monsters in the database`} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {monsters.data.map((monster) => (
          <Card key={monster.id} href={`/monsters/${monster.id}`}>
            <div className="flex items-center gap-3">
              <Icon src={monster.icon_url} alt={monster.name} />
              <div className="min-w-0">
                <div className="truncate font-semibold text-white group-hover:text-accent">
                  {monster.name}
                </div>
                <div className="truncate text-xs text-white/50">{monster.class}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Pagination
        basePath="/monsters"
        query={{ page }}
        currentPage={monsters.meta.current_page}
        lastPage={monsters.meta.last_page}
        total={monsters.meta.total}
      />
    </div>
  );
}
