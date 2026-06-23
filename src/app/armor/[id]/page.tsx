import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { api } from "@/lib/api/client";
import type { Armor } from "@/lib/api/types";
import { Icon, Pill, Section, StatTile } from "@/components/ui";

async function load(id: string): Promise<Armor> {
  try {
    const { data } = await api.armor(id);
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
  const armor = await load(id);
  return { title: armor.name ?? "Armor" };
}

const RESISTANCES = ["fire", "water", "thunder", "ice", "dragon"] as const;

export default async function ArmorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const armor = await load(id);

  return (
    <article>
      <div className="flex items-center gap-4">
        <Icon src={armor.icon_url} alt={armor.name ?? "Armor"} size={64} />
        <div>
          <h1 className="text-3xl font-bold text-white">{armor.name}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <Pill>{armor.slot}</Pill>
            {armor.hunter_type && armor.hunter_type !== "Both" && <Pill>{armor.hunter_type}</Pill>}
            {armor.gender && armor.gender !== "Both" && <Pill>{armor.gender}</Pill>}
          </div>
        </div>
      </div>

      <Section title="Defense">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label="Defense" value={armor.defense} />
          {armor.max_defense ? <StatTile label="Max Defense" value={armor.max_defense} /> : null}
          <StatTile label="Slots" value={"◯".repeat(armor.num_slots ?? 0) || "—"} />
        </div>
      </Section>

      <Section title="Resistances">
        <div className="grid grid-cols-5 gap-2">
          {RESISTANCES.map((element) => (
            <StatTile key={element} label={element} value={armor.resistances[element]} />
          ))}
        </div>
      </Section>

      {armor.skill_trees && armor.skill_trees.length > 0 && (
        <Section title="Skills">
          <div className="flex flex-wrap gap-2">
            {armor.skill_trees.map((skill) => (
              <span
                key={skill.id}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-white/85"
              >
                {skill.name}{" "}
                <span className={skill.points && skill.points < 0 ? "text-red-400" : "text-accent"}>
                  {skill.points && skill.points > 0 ? `+${skill.points}` : skill.points}
                </span>
              </span>
            ))}
          </div>
        </Section>
      )}
    </article>
  );
}
