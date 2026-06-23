import type { Metadata } from "next";
import Link from "next/link";
import { api } from "@/lib/api/client";
import { Card, Icon, PageHeading, RarityBadge } from "@/components/ui";
import { Pagination } from "@/components/Pagination";

export const metadata: Metadata = { title: "Armor" };

const SLOTS = ["Head", "Body", "Arms", "Waist", "Legs"];

export default async function ArmorPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; slot?: string }>;
}) {
  const { page, slot } = await searchParams;
  const armor = await api.armorList({ page, per_page: 50, "filter[slot]": slot });

  return (
    <div>
      <PageHeading title="Armor" subtitle={`${armor.meta.total} pieces`} />

      <div className="mb-6 flex flex-wrap gap-1.5">
        <Link
          href="/armor"
          className={`rounded-full px-3 py-1 text-xs transition ${
            !slot ? "bg-accent text-black" : "border border-white/15 text-white/70 hover:text-white"
          }`}
        >
          All
        </Link>
        {SLOTS.map((option) => (
          <Link
            key={option}
            href={`/armor?slot=${option}`}
            className={`rounded-full px-3 py-1 text-xs transition ${
              slot === option ? "bg-accent text-black" : "border border-white/15 text-white/70 hover:text-white"
            }`}
          >
            {option}
          </Link>
        ))}
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
        query={{ page, slot }}
        currentPage={armor.meta.current_page}
        lastPage={armor.meta.last_page}
        total={armor.meta.total}
      />
    </div>
  );
}
