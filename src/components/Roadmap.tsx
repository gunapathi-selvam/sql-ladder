import Link from "next/link";
import type { RoadmapStage, Topic } from "@/lib/types";
import { LEVEL_LABEL } from "@/lib/types";

interface Props {
  trackId: string;
  stages: RoadmapStage[];
  topics: Pick<Topic, "id" | "title" | "icon" | "level" | "questions">[];
  /** Compact mode used on the dashboard. */
  compact?: boolean;
}

export default function Roadmap({ trackId, stages, topics, compact = false }: Props) {
  const byId = new Map(topics.map((t) => [t.id, t]));

  return (
    <ol className="relative space-y-6 border-l-2 border-zinc-200 pl-6 dark:border-zinc-800">
      {stages.map((stage, i) => (
        <li key={stage.id} className="relative">
          <span className="bg-accent absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ring-4 ring-paper dark:ring-paper-dark">
            {i + 1}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold tracking-tight">{stage.title}</h3>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
              {LEVEL_LABEL[stage.level]}
            </span>
          </div>
          {!compact && (
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{stage.blurb}</p>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            {stage.topicIds.map((tid) => {
              const t = byId.get(tid);
              if (!t) return null;
              return (
                <Link
                  key={tid}
                  href={`/learn/${trackId}/${tid}`}
                  className="hover-accent inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-sm text-zinc-700 transition-colors dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                >
                  <span aria-hidden>{t.icon}</span>
                  {t.title}
                  {!compact && (
                    <span className="text-xs text-zinc-400">({t.questions.length})</span>
                  )}
                </Link>
              );
            })}
          </div>
        </li>
      ))}
    </ol>
  );
}
