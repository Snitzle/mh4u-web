import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "@/lib/api/client";
import type { Weapon } from "@/lib/api/types";
import { Icon, Pill, Section, StatTile } from "@/components/ui";

async function load(id: string): Promise<Weapon> {
  try {
    const { data } = await api.weapon(id);
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
  const weapon = await load(id);
  return { title: weapon.name ?? "Weapon" };
}

export default async function WeaponPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const weapon = await load(id);

  return (
    <article>
      <div className="flex items-center gap-4">
        <Icon src={weapon.icon_url} alt={weapon.name ?? "Weapon"} size={72} />
        <div>
          <h1 className="text-3xl font-bold text-white">{weapon.name}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <Pill>{weapon.wtype}</Pill>
            {weapon.final && <Pill>Final form</Pill>}
          </div>
        </div>
      </div>

      <Section title="Stats">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label="Attack" value={weapon.attack} />
          <StatTile label="Affinity" value={weapon.affinity} />
          {weapon.element && (
            <StatTile label={weapon.element.type} value={weapon.element.attack ?? "—"} />
          )}
          {weapon.defense ? <StatTile label="Defense" value={weapon.defense} /> : null}
          <StatTile label="Slots" value={"◯".repeat(weapon.num_slots) || "—"} />
        </div>
        {weapon.sharpness && (
          <p className="mt-3 text-sm text-white/60">
            <span className="text-white/40">Sharpness:</span> {weapon.sharpness}
          </p>
        )}
        {weapon.ammo && (
          <p className="mt-3 text-sm text-white/60">
            <span className="text-white/40">Ammo:</span> {weapon.ammo}
          </p>
        )}
      </Section>

      {weapon.melodies && weapon.melodies.length > 0 && (
        <Section title="Hunting Horn Melodies">
          <ul className="space-y-1.5">
            {weapon.melodies.map((melody, index) => (
              <li
                key={index}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm"
              >
                <span className="text-white/85">{melody.song}</span>
                <span className="text-xs text-white/40">{melody.duration}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {weapon.children && weapon.children.length > 0 && (
        <Section title="Upgrades into">
          <div className="flex flex-wrap gap-2">
            {weapon.children.map((child) => (
              <Link
                key={child.id}
                href={`/weapons/${child.id}`}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-white/80 transition hover:border-accent/50 hover:text-accent"
              >
                {child.name} <span className="text-white/40">ATK {child.attack}</span>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </article>
  );
}
