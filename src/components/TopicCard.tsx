"use client";

import Link from "next/link";
import type { Topic } from "@/lib/types";
import { useAllProgress, countDone } from "@/lib/progress";
import { LevelBadge } from "./Badges";
import ProgressBar from "./ProgressBar";

export default function TopicCard({ trackId, topic }: { trackId: string; topic: Topic }) {
  const progress = useAllProgress();
  const done = countDone(progress, trackId, topic.id);
  const total = topic.questions.length;
  const categories = new Set(topic.questions.map((q) => q.category)).size;

  return (
    <Link
      href={`/learn/${trackId}/${topic.id}`}
      className="hover-accent group flex h-full flex-col rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="text-3xl" aria-hidden>{topic.icon}</div>
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          {total} Qs
        </span>
      </div>

      <h3 className="group-hover:text-accent mt-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        {topic.title}
      </h3>
      <p className="mt-1 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400">{topic.description}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
        <LevelBadge level={topic.level} />
        <span>{categories} categories</span>
      </div>

      <div className="mt-auto pt-4">
        <ProgressBar value={done} max={total} />
      </div>
    </Link>
  );
}
