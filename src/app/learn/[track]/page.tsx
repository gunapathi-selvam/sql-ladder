import Link from "next/link";
import { notFound } from "next/navigation";
import { getTrack, trackQuestionCount } from "@/lib/data";
import { LEVEL_ORDER, LEVEL_LABEL, type Level } from "@/lib/types";
import Roadmap from "@/components/Roadmap";
import TopicCard from "@/components/TopicCard";

export function generateMetadata({ params }: { params: { track: string } }) {
  const track = getTrack(params.track);
  if (!track) return { title: "Track not found" };
  return {
    title: `${track.title} · Code Ladder`,
    description: track.description,
  };
}

export default function TrackPage({ params }: { params: { track: string } }) {
  const track = getTrack(params.track);
  if (!track) notFound();

  const total = trackQuestionCount(track);
  const levels = LEVEL_ORDER.filter((lvl) => track.topics.some((t) => t.level === lvl));

  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-10 dark:border-zinc-800 dark:bg-zinc-900">
        <Link href="/" className="text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
          ← All tracks
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span className="bg-accent-soft text-accent flex h-12 w-12 items-center justify-center rounded-xl text-2xl">
            {track.icon}
          </span>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{track.title}</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{track.tagline}</p>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-base text-zinc-600 dark:text-zinc-300">{track.description}</p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            {track.topics.length} topics
          </span>
          <span className="rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            {total} questions
          </span>
          <Link href={`/learn/${track.id}/answers`} className="bg-accent rounded-full px-3 py-1 font-semibold">
            📋 Answer sheet
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-6 text-2xl font-bold tracking-tight">Your roadmap</h2>
        <Roadmap trackId={track.id} stages={track.roadmap} topics={track.topics} />
      </section>

      {levels.map((lvl: Level) => (
        <section key={lvl}>
          <h2 className="mb-4 text-xl font-bold tracking-tight">{LEVEL_LABEL[lvl]}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {track.topics
              .filter((t) => t.level === lvl)
              .map((t) => (
                <TopicCard key={t.id} trackId={track.id} topic={t} />
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
