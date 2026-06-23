import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "@/lib/api/client";
import type { Monster } from "@/lib/api/types";
import { Card, Icon, Pill, Section } from "@/components/ui";

async function load(id: string): Promise<Monster> {
  try {
    const { data } = await api.monster(id);
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
  const monster = await load(id);
  return { title: monster.name };
}

const ELEMENTS = ["fire", "water", "thunder", "ice", "dragon"] as const;

function Rating({ value }: { value: number }) {
  return (
    <span className="font-mono text-sm">
      {[0, 1, 2].map((i) => (
        <span key={i} className={i < value ? "text-accent" : "text-white/15"}>
          ●
        </span>
      ))}
    </span>
  );
}

export default async function MonsterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const monster = await load(id);

  return (
    <article>
      <div className="flex items-center gap-4">
        <Icon src={monster.icon_url} alt={monster.name} size={72} />
        <div>
          <h1 className="text-3xl font-bold text-white">{monster.name}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <Pill>{monster.class}</Pill>
            {monster.trait && <Pill>{monster.trait}</Pill>}
          </div>
        </div>
      </div>

      {monster.weaknesses && monster.weaknesses.length > 0 && (
        <Section title="Weaknesses">
          <div className="grid gap-3 sm:grid-cols-2">
            {monster.weaknesses.map((weakness) => (
              <div key={weakness.state} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-2 text-sm font-semibold text-white/80">{weakness.state}</div>
                <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                  {ELEMENTS.map((element) => (
                    <div key={element} className="flex items-center gap-1.5">
                      <span className="w-14 text-xs capitalize text-white/50">{element}</span>
                      <Rating value={weakness.elements[element]} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {monster.hunting_rewards && Object.keys(monster.hunting_rewards).length > 0 && (
        <Section title="Rewards">
          <div className="grid gap-4 lg:grid-cols-3">
            {Object.entries(monster.hunting_rewards).map(([rank, rewards]) => (
              <div key={rank}>
                <div className="mb-2 text-xs font-bold uppercase text-white/40">{rank}</div>
                <ul className="space-y-1.5">
                  {rewards.map((reward, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm"
                    >
                      <Link
                        href={reward.item ? `/items/${reward.item.id}` : "#"}
                        className="truncate text-white/80 hover:text-accent"
                      >
                        {reward.item?.name ?? "—"}
                      </Link>
                      <span className="shrink-0 text-xs text-white/40">
                        {reward.condition} · {reward.percentage}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}

      {monster.habitats && monster.habitats.length > 0 && (
        <Section title="Habitats">
          <div className="flex flex-wrap gap-2">
            {monster.habitats.map((habitat, index) => (
              <Pill key={index}>{habitat.location?.name ?? "Unknown"}</Pill>
            ))}
          </div>
        </Section>
      )}

      {monster.quests && monster.quests.length > 0 && (
        <Section title="Appears in quests">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {monster.quests.map((quest) => (
              <Card key={quest.id} href={`/quests/${quest.id}`}>
                <div className="truncate text-sm font-medium text-white/90 group-hover:text-accent">
                  {quest.name}
                </div>
                <div className="text-xs text-white/40">
                  {"★".repeat(quest.stars)} · {quest.hub}
                </div>
              </Card>
            ))}
          </div>
        </Section>
      )}
    </article>
  );
}
