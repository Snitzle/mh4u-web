import Link from "next/link";
import { ENTITIES } from "@/lib/nav";

export default function HomePage() {
  return (
    <div>
      <section className="py-10 text-center sm:py-16">
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
          <span className="text-accent">MH4U</span> Database
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-balance text-white/60">
          Everything you need for the hunt — monsters and their weaknesses, weapon trees, armor
          skills, item sources and quests. Fast, searchable, and always one tap away.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ENTITIES.map((entity) => (
          <Link
            key={entity.href}
            href={entity.href}
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-accent/50 hover:bg-white/[0.06]"
          >
            <h2 className="text-xl font-bold text-white group-hover:text-accent">{entity.label}</h2>
            <p className="mt-1 text-sm text-white/50">{entity.blurb}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
