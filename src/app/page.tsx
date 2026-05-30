import Link from "next/link";
import { tracks, trackSummaries } from "@/lib/data";
import TrackCard from "@/components/TrackCard";
import Roadmap from "@/components/Roadmap";

export default function Dashboard() {
  const summaries = trackSummaries();
  const totalQuestions = summaries.reduce((s, t) => s + t.questionCount, 0);

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-8 sm:p-12 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="relative max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-paper px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
            🪜 Learn step by step
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
            Code Ladder
          </h1>
          <p className="mt-3 text-base text-zinc-600 sm:text-lg dark:text-zinc-300">
            A calm, self-paced way to practise <span className="font-semibold">SQL</span>,{" "}
            <span className="font-semibold">HTML</span>, <span className="font-semibold">CSS</span> and{" "}
            <span className="font-semibold">JavaScript</span>. Follow a roadmap, work through{" "}
            {totalQuestions}+ categorized questions, reveal hints and solutions, and watch your progress
            grow — all saved on your device.
          </p>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-bold tracking-tight">Choose a track</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Each track has its own roadmap, topics and questions. Progress is saved per track.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {summaries.map((t) => (
            <TrackCard key={t.id} track={t} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Learning roadmaps</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Pick a heading to jump straight into that section and start learning.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {tracks.map((t) => (
            <div
              key={t.id}
              className={`track-${t.id} rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900`}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 text-lg font-bold tracking-tight">
                  <span className="bg-accent-soft text-accent flex h-9 w-9 items-center justify-center rounded-lg text-lg">
                    {t.icon}
                  </span>
                  {t.title}
                </h3>
                <Link
                  href={`/learn/${t.id}`}
                  className="text-accent text-sm font-semibold hover:underline"
                >
                  Open track →
                </Link>
              </div>
              <Roadmap trackId={t.id} stages={t.roadmap} topics={t.topics} compact />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
