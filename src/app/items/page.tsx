import type { Metadata } from "next";
import { api } from "@/lib/api/client";
import { Card, Icon, PageHeading, RarityBadge } from "@/components/ui";
import { FilterChips } from "@/components/Filters";
import { Pagination } from "@/components/Pagination";
import { RARITY_OPTIONS } from "@/lib/url";

export const metadata: Metadata = { title: "Items" };

export default async function ItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; type?: string; rarity?: string }>;
}) {
  const { page, type, rarity } = await searchParams;
  const items = await api.items({
    page,
    per_page: 60,
    "filter[type]": type,
    "filter[rarity]": rarity,
    sort: "name",
  });

  return (
    <div>
      <PageHeading title="Items" subtitle={`${items.meta.total} items`} />

      <div className="mb-6">
        <FilterChips label="Rarity" param="rarity" options={RARITY_OPTIONS} active={rarity} basePath="/items" query={{ type, rarity }} />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {items.data.map((item) => (
          <Card key={item.id} href={`/items/${item.id}`}>
            <div className="flex items-center gap-3">
              <Icon src={item.icon_url} alt={item.name} size={36} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-white group-hover:text-accent">
                  {item.name}
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-white/45">
                  <span>{item.type}</span>
                  <RarityBadge rarity={item.rarity} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Pagination
        basePath="/items"
        query={{ page, type, rarity }}
        currentPage={items.meta.current_page}
        lastPage={items.meta.last_page}
        total={items.meta.total}
      />
    </div>
  );
}
