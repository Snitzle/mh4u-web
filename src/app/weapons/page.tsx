import type { Metadata } from "next";
import Link from "next/link";
import { api } from "@/lib/api/client";
import { Card, Icon, PageHeading, RarityBadge } from "@/components/ui";
import { Pagination } from "@/components/Pagination";

export const metadata: Metadata = { title: "Weapons" };

const WEAPON_TYPES = [
  "Great Sword", "Long Sword", "Sword and Shield", "Dual Blades", "Hammer",
  "Hunting Horn", "Lance", "Gunlance", "Switch Axe", "Charge Blade",
  "Insect Glaive", "Light Bowgun", "Heavy Bowgun", "Bow",
];

export default async function WeaponsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; wtype?: string }>;
}) {
  const { page, wtype } = await searchParams;
  const weapons = await api.weapons({ page, per_page: 50, "filter[wtype]": wtype });

  return (
    <div>
      <PageHeading title="Weapons" subtitle={`${weapons.meta.total} weapons`} />

      <div className="mb-6 flex flex-wrap gap-1.5">
        <Link
          href="/weapons"
          className={`rounded-full px-3 py-1 text-xs transition ${
            !wtype ? "bg-accent text-black" : "border border-white/15 text-white/70 hover:text-white"
          }`}
        >
          All
        </Link>
        {WEAPON_TYPES.map((type) => (
          <Link
            key={type}
            href={`/weapons?wtype=${encodeURIComponent(type)}`}
            className={`rounded-full px-3 py-1 text-xs transition ${
              wtype === type ? "bg-accent text-black" : "border border-white/15 text-white/70 hover:text-white"
            }`}
          >
            {type}
          </Link>
        ))}
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
        query={{ page, wtype }}
        currentPage={weapons.meta.current_page}
        lastPage={weapons.meta.last_page}
        total={weapons.meta.total}
      />
    </div>
  );
}
