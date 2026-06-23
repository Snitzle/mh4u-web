import type { Metadata } from "next";
import Link from "next/link";
import { api } from "@/lib/api/client";
import { Card, PageHeading } from "@/components/ui";
import { Pagination } from "@/components/Pagination";

export const metadata: Metadata = { title: "Quests" };

const HUBS = ["Caravan", "Guild", "Event"];

export default async function QuestsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; hub?: string }>;
}) {
  const { page, hub } = await searchParams;
  const quests = await api.quests({ page, per_page: 40, "filter[hub]": hub });

  return (
    <div>
      <PageHeading title="Quests" subtitle={`${quests.meta.total} quests`} />

      <div className="mb-6 flex flex-wrap gap-1.5">
        <Link
          href="/quests"
          className={`rounded-full px-3 py-1 text-xs transition ${
            !hub ? "bg-accent text-black" : "border border-white/15 text-white/70 hover:text-white"
          }`}
        >
          All
        </Link>
        {HUBS.map((option) => (
          <Link
            key={option}
            href={`/quests?hub=${option}`}
            className={`rounded-full px-3 py-1 text-xs transition ${
              hub === option ? "bg-accent text-black" : "border border-white/15 text-white/70 hover:text-white"
            }`}
          >
            {option}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {quests.data.map((quest) => (
          <Card key={quest.id} href={`/quests/${quest.id}`}>
            <div className="font-medium text-white group-hover:text-accent">{quest.name}</div>
            <div className="mt-1 flex items-center gap-2 text-xs text-white/45">
              <span className="text-accent">{"★".repeat(quest.stars)}</span>
              <span>{quest.hub}</span>
              <span>·</span>
              <span>{quest.type}</span>
            </div>
          </Card>
        ))}
      </div>

      <Pagination
        basePath="/quests"
        query={{ page, hub }}
        currentPage={quests.meta.current_page}
        lastPage={quests.meta.last_page}
        total={quests.meta.total}
      />
    </div>
  );
}
