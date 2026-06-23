import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "@/lib/api/client";
import type { Item } from "@/lib/api/types";
import { Icon, Pill, Section, StatTile } from "@/components/ui";

async function load(id: string): Promise<Item> {
  try {
    const { data } = await api.item(id);
    return data;
  } catch {
    notFound();
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = await load(id);
  return { title: item.name };
}

export default async function ItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await load(id);

  return (
    <article>
      <div className="flex items-center gap-4">
        <Icon src={item.icon_url} alt={item.name} size={64} />
        <div>
          <h1 className="text-3xl font-bold text-white">{item.name}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <Pill>{item.type}</Pill>
            {item.rarity > 0 && <Pill>Rarity {item.rarity}</Pill>}
          </div>
        </div>
      </div>

      {item.description && <p className="mt-4 max-w-2xl text-white/70">{item.description}</p>}

      <Section title="Details">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label="Buy" value={item.buy ? `${item.buy}z` : "—"} />
          <StatTile label="Sell" value={item.sell ? `${item.sell}z` : "—"} />
          <StatTile label="Carry" value={item.carry_capacity} />
        </div>
      </Section>

      {item.monster_rewards && item.monster_rewards.length > 0 && (
        <Section title="Carve / Capture from">
          <SourceList
            rows={item.monster_rewards.map((reward) => ({
              href: reward.monster ? `/monsters/${reward.monster.id}` : undefined,
              label: reward.monster?.name ?? "—",
              meta: `${reward.rank} · ${reward.condition} · ${reward.percentage}%`,
            }))}
          />
        </Section>
      )}

      {item.gathering && item.gathering.length > 0 && (
        <Section title="Gather at">
          <SourceList
            rows={item.gathering.map((spot) => ({
              href: spot.location ? `/locations/${spot.location.id}` : undefined,
              label: spot.location?.name ?? spot.area,
              meta: `${spot.rank} · ${spot.area} ${spot.site}`,
            }))}
          />
        </Section>
      )}

      {item.quest_rewards && item.quest_rewards.length > 0 && (
        <Section title="Quest rewards">
          <SourceList
            rows={item.quest_rewards.map((reward) => ({
              href: reward.quest ? `/quests/${reward.quest.id}` : undefined,
              label: reward.quest?.name ?? "—",
              meta: `Slot ${reward.reward_slot} · ${reward.percentage}%`,
            }))}
          />
        </Section>
      )}

      {item.components_required && item.components_required.length > 0 && (
        <Section title="Crafted from">
          <SourceList
            rows={item.components_required.map((component) => ({
              href: component.component_item ? `/items/${component.component_item.id}` : undefined,
              label: component.component_item?.name ?? "—",
              meta: `×${component.quantity}`,
            }))}
          />
        </Section>
      )}

      {item.used_in && item.used_in.length > 0 && (
        <Section title="Used to craft">
          <SourceList
            rows={item.used_in.map((component) => ({
              href: component.created_item ? `/items/${component.created_item.id}` : undefined,
              label: component.created_item?.name ?? "—",
              meta: `×${component.quantity}`,
            }))}
          />
        </Section>
      )}
    </article>
  );
}

function SourceList({
  rows,
}: {
  rows: { href?: string; label: string; meta: string }[];
}) {
  return (
    <ul className="grid gap-1.5 sm:grid-cols-2">
      {rows.map((row, index) => (
        <li
          key={index}
          className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm"
        >
          {row.href ? (
            <Link href={row.href} className="truncate text-white/85 hover:text-accent">
              {row.label}
            </Link>
          ) : (
            <span className="truncate text-white/85">{row.label}</span>
          )}
          <span className="shrink-0 text-xs text-white/40">{row.meta}</span>
        </li>
      ))}
    </ul>
  );
}
