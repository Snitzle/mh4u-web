import type { Metadata } from "next";
import { api } from "@/lib/api/client";
import { Card, Icon, PageHeading, RarityBadge } from "@/components/ui";
import { FilterChips } from "@/components/Filters";
import { Pagination } from "@/components/Pagination";
import { RARITY_OPTIONS } from "@/lib/url";

export const metadata: Metadata = { title: "Armor" };

const SLOTS = ["Head", "Body", "Arms", "Waist", "Legs"].map((slot) => ({ value: slot, label: slot }));

export default async function ArmorPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; slot?: string; rarity?: string }>;
}) {
  const { page, slot, rarity } = await searchParams;
  const armor = await api.armorList({
    page,
    per_page: 50,
    "filter[slot]": slot,
    "filter[rarity]": rarity,
  });

  return (
    <div>
      <PageHeading title="Armor" subtitle={`${armor.meta.total} pieces`} />

      <div className="mb-6 space-y-3">
        <FilterChips label="Slot" param="slot" options={SLOTS} active={slot} basePath="/armor" query={{ slot, rarity }} />
        <FilterChips label="Rarity" param="rarity" options={RARITY_OPTIONS} active={rarity} basePath="/armor" query={{ slot, rarity }} />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {armor.data.map((piece) => (
          <Card key={piece.id} href={`/armor/${piece.id}`}>
            <div className="flex items-center gap-3">
              <Icon src={piece.icon_url} alt={piece.name ?? "Armor"} />
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold text-white group-hover:text-accent">
                  {piece.name}
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-white/50">
                  <span>{piece.slot}</span>
                  <span>DEF {piece.defense}</span>
                  <RarityBadge rarity={piece.rarity} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Pagination
        basePath="/armor"
        query={{ page, slot, rarity }}
        currentPage={armor.meta.current_page}
        lastPage={armor.meta.last_page}
        total={armor.meta.total}
      />
    </div>
  );
}
