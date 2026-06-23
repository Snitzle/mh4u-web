import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "@/lib/api/client";
import type { Quest } from "@/lib/api/types";
import { Card, Icon, Pill, Section, StatTile } from "@/components/ui";

async function load(id: string): Promise<Quest> {
  try {
    const { data } = await api.quest(id);
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
  const quest = await load(id);
  return { title: quest.name };
}

export default async function QuestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const quest = await load(id);

  return (
    <article>
      <h1 className="text-3xl font-bold text-white">{quest.name}</h1>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="text-accent">{"★".repeat(quest.stars)}</span>
        <Pill>{quest.hub}</Pill>
        <Pill>{quest.type}</Pill>
        {quest.location && <Pill>{quest.location.name}</Pill>}
      </div>

      <p className="mt-4 max-w-2xl text-white/70">{quest.goal}</p>

      <Section title="Rewards & fees">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label="Reward" value={`${quest.reward}z`} />
          <StatTile label="Fee" value={`${quest.fee}z`} />
          {quest.hrp ? <StatTile label="HRP" value={quest.hrp} /> : null}
        </div>
      </Section>

      {quest.monsters && quest.monsters.length > 0 && (
        <Section title="Monsters">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {quest.monsters.map((monster) => (
              <Card key={monster.id} href={`/monsters/${monster.id}`}>
                <div className="flex items-center gap-3">
                  <Icon src={monster.icon_url} alt={monster.name} />
                  <span className="font-medium text-white group-hover:text-accent">{monster.name}</span>
                </div>
              </Card>
            ))}
          </div>
        </Section>
      )}

      {quest.rewards && Object.keys(quest.rewards).length > 0 && (
        <Section title="Item rewards">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(quest.rewards).map(([slot, rewards]) => (
              <div key={slot}>
                <div className="mb-2 text-xs font-bold uppercase text-white/40">Slot {slot}</div>
                <ul className="space-y-1.5">
                  {rewards.map((reward, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm"
                    >
                      <Link
                        href={reward.item ? `/items/${reward.item.id}` : "#"}
                        className="truncate text-white/85 hover:text-accent"
                      >
                        {reward.item?.name ?? "—"}
                      </Link>
                      <span className="shrink-0 text-xs text-white/40">{reward.percentage}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}
    </article>
  );
}
