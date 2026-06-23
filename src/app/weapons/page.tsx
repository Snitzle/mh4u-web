import type { Metadata } from "next";
import { api } from "@/lib/api/client";
import { Card, Icon, PageHeading, RarityBadge } from "@/components/ui";
import { FilterChips } from "@/components/Filters";
import { Pagination } from "@/components/Pagination";
import { RARITY_OPTIONS } from "@/lib/url";

export const metadata: Metadata = { title: "Weapons" };

const WEAPON_TYPES = [
  "Great Sword", "Long Sword", "Sword and Shield", "Dual Blades", "Hammer",
  "Hunting Horn", "Lance", "Gunlance", "Switch Axe", "Charge Blade",
  "Insect Glaive", "Light Bowgun", "Heavy Bowgun", "Bow",
].map((type) => ({ value: type, label: type }));

export default async function WeaponsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; wtype?: string; rarity?: string }>;
}) {
  const { page, wtype, rarity } = await searchParams;
  const weapons = await api.weapons({
    page,
    per_page: 50,
    "filter[wtype]": wtype,
    "filter[rarity]": rarity,
  });

  return (
    <div>
      <PageHeading title="Weapons" subtitle={`${weapons.meta.total} weapons`} />

      <div className="mb-6 space-y-3">
        <FilterChips label="Type" param="wtype" options={WEAPON_TYPES} active={wtype} basePath="/weapons" query={{ wtype, rarity }} />
        <FilterChips label="Rarity" param="rarity" options={RARITY_OPTIONS} active={rarity} basePath="/weapons" query={{ wtype, rarity }} />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {weapons.data.map((weapon) => (
          <Card key={weapon.id} href={`/weapons/${weapon.id}`}>
            <div className="flex items-center gap-3">
              <Icon src={weapon.icon_url} alt={weapon.name ?? "Weapon"} />
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold text-white group-hover:text-accent">
                  {weapon.name}
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-white/50">
                  <span>ATK {weapon.attack}</span>
                  <RarityBadge rarity={weapon.rarity} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Pagination
        basePath="/weapons"
        query={{ page, wtype, rarity }}
        currentPage={weapons.meta.current_page}
        lastPage={weapons.meta.last_page}
        total={weapons.meta.total}
      />
    </div>
  );
}
