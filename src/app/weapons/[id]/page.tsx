import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "@/lib/api/client";
import type { SharpnessColour, Weapon } from "@/lib/api/types";
import { Icon, Pill, Section, StatTile } from "@/components/ui";

const SHARPNESS_COLOURS: { key: SharpnessColour; hex: string }[] = [
  { key: "red", hex: "#d63b3b" },
  { key: "orange", hex: "#e0822d" },
  { key: "yellow", hex: "#e3cf2d" },
  { key: "green", hex: "#46c046" },
  { key: "blue", hex: "#3f86df" },
  { key: "white", hex: "#e9e9e9" },
  { key: "purple", hex: "#c77dff" },
];

function SharpnessBar({ values }: { values: Record<SharpnessColour, number> }) {
  const total = SHARPNESS_COLOURS.reduce((sum, c) => sum + (values[c.key] || 0), 0);
  if (total === 0) return <span className="text-sm text-white/40">—</span>;
  return (
    <div className="flex h-3 w-full max-w-md overflow-hidden rounded-sm">
      {SHARPNESS_COLOURS.map((c) =>
        (values[c.key] || 0) === 0 ? null : (
          <div
            key={c.key}
            style={{ width: `${(values[c.key] / total) * 100}%`, backgroundColor: c.hex }}
            title={`${c.key}: ${values[c.key]}`}
          />
        ),
      )}
    </div>
  );
}

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
          <div className="mt-4 space-y-2">
            <div>
              <div className="mb-1 text-[11px] uppercase tracking-wide text-white/40">Sharpness</div>
              <SharpnessBar values={weapon.sharpness.normal} />
            </div>
            <div>
              <div className="mb-1 text-[11px] uppercase tracking-wide text-white/40">Sharpness +1</div>
              <SharpnessBar values={weapon.sharpness.plus} />
            </div>
          </div>
        )}
      </Section>

      {weapon.ammo && weapon.ammo.length > 0 && (
        <Section title="Ammo">
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-white/40">
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2 text-right">Capacity</th>
                </tr>
              </thead>
              <tbody>
                {weapon.ammo.map((round, index) => (
                  <tr key={index} className="border-t border-white/5">
                    <td className="px-3 py-2 text-white/85">{round.item}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-white/70">
                      {round.capacity}
                      {round.special ? ` (+${round.special})` : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

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
