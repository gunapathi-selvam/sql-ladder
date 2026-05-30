"use client";

import Link from "next/link";
import type { TrackSummary } from "@/lib/data";
import { LEVEL_LABEL } from "@/lib/types";
import { useAllProgress, countTrackDone } from "@/lib/progress";
import ProgressBar from "./ProgressBar";

export default function TrackCard({ track }: { track: TrackSummary }) {
  const progress = useAllProgress();
  const done = countTrackDone(progress, track.id);

  return (
    <Link
      href={`/learn/${track.id}`}
      className={`track-${track.id} hover-accent group flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="bg-accent-soft text-accent flex h-12 w-12 items-center justify-center rounded-xl text-2xl">
          {track.icon}
        </span>
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          {track.questionCount} Qs
        </span>
      </div>

      <h3 className="group-hover:text-accent mt-4 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        {track.title}
      </h3>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{track.tagline}</p>

      <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
        <span>{track.topicCount} topics</span>
        <span aria-hidden>·</span>
        <span>{track.levels.map((l) => LEVEL_LABEL[l]).join(" → ")}</span>
      </div>

      <div className="mt-auto pt-5">
        <ProgressBar value={done} max={track.questionCount} />
      </div>
    </Link>
  );
}
