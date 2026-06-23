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
const AILMENTS = ["poison", "paralysis", "sleep"] as const;
const TRAPS = ["pitfall_trap", "shock_trap", "flash_bomb", "sonic_bomb", "dung_bomb", "meat"] as const;

type HitzoneKey = "cut" | "impact" | "shot" | "fire" | "water" | "ice" | "thunder" | "dragon" | "ko";

const HITZONE_COLS: { key: HitzoneKey; label: string }[] = [
  { key: "cut", label: "Cut" },
  { key: "impact", label: "Impact" },
  { key: "shot", label: "Shot" },
  { key: "fire", label: "Fire" },
  { key: "water", label: "Water" },
  { key: "ice", label: "Ice" },
  { key: "thunder", label: "Thunder" },
  { key: "dragon", label: "Dragon" },
  { key: "ko", label: "KO" },
];

function Rating({ value }: { value: number }) {
  return (
    <span className="font-mono text-sm" title={String(value)}>
      {[0, 1, 2].map((i) => (
        <span key={i} className={i < value ? "text-accent" : "text-white/15"}>
          ●
        </span>
      ))}
    </span>
  );
}

function RatingRow({ items }: { items: { label: string; value: number }[] }) {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-1.5">
      {items.map(({ label, value }) => (
        <div key={label} className="flex items-center gap-1.5">
          <span className="text-xs capitalize text-white/50">{label.replace("_", " ")}</span>
          <Rating value={value} />
        </div>
      ))}
    </div>
  );
}

function cell(value: number | null): string {
  if (value === null || value < 0) return "—";
  return String(value);
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

      {monster.ailments && monster.ailments.length > 0 && (
        <Section title="Inflicts">
          <div className="flex flex-wrap gap-2">
            {monster.ailments.map((ailment) => (
              <Pill key={ailment}>{ailment}</Pill>
            ))}
          </div>
        </Section>
      )}

      {monster.weaknesses && monster.weaknesses.length > 0 && (
        <Section title="Effectiveness">
          <div className="grid gap-3 lg:grid-cols-2">
            {monster.weaknesses.map((weakness) => (
              <div key={weakness.state} className="space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="text-sm font-semibold text-white/80">{weakness.state}</div>
                <div>
                  <div className="mb-1 text-[11px] uppercase tracking-wide text-white/30">Elements</div>
                  <RatingRow items={ELEMENTS.map((e) => ({ label: e, value: weakness.elements[e] }))} />
                </div>
                <div>
                  <div className="mb-1 text-[11px] uppercase tracking-wide text-white/30">Status</div>
                  <RatingRow items={AILMENTS.map((a) => ({ label: a, value: weakness.ailments[a] }))} />
                </div>
                <div>
                  <div className="mb-1 text-[11px] uppercase tracking-wide text-white/30">Traps &amp; bombs</div>
                  <RatingRow items={TRAPS.map((t) => ({ label: t, value: weakness.traps[t] ?? 0 }))} />
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {monster.damage && monster.damage.length > 0 && (
        <Section title="Hitzones">
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-white/40">
                  <th className="px-3 py-2">Part</th>
                  {HITZONE_COLS.map((col) => (
                    <th key={col.key} className="px-3 py-2 text-right">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {monster.damage.map((zone) => (
                  <tr key={zone.body_part} className="border-t border-white/5">
                    <td className="px-3 py-2 font-medium text-white/90">{zone.body_part}</td>
                    {HITZONE_COLS.map((col) => (
                      <td key={col.key} className="px-3 py-2 text-right tabular-nums text-white/70">
                        {cell(zone[col.key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {monster.statuses && monster.statuses.length > 0 && (
        <Section title="Status tolerance">
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-white/40">
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2 text-right">Initial</th>
                  <th className="px-3 py-2 text-right">Buildup</th>
                  <th className="px-3 py-2 text-right">Max</th>
                  <th className="px-3 py-2 text-right">Duration</th>
                  <th className="px-3 py-2 text-right">Damage</th>
                </tr>
              </thead>
              <tbody>
                {monster.statuses.map((status) => (
                  <tr key={status.status} className="border-t border-white/5">
                    <td className="px-3 py-2 font-medium text-white/90">{status.status}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-white/70">{cell(status.initial)}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-white/70">{cell(status.increase)}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-white/70">{cell(status.max)}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-white/70">
                      {status.duration ? `${status.duration}s` : "—"}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-white/70">{status.damage || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            {Array.from(new Map(monster.quests.map((q) => [q.id, q])).values()).map((quest) => (
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
