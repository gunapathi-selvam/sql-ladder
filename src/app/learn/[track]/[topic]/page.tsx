import { notFound } from "next/navigation";
import { getTrack, getTopic, tracks } from "@/lib/data";
import TopicView from "@/components/TopicView";

export function generateStaticParams() {
  return tracks.flatMap((t) =>
    t.topics.map((tp) => ({ track: t.id, topic: tp.id }))
  );
}

export function generateMetadata({ params }: { params: { track: string; topic: string } }) {
  const track = getTrack(params.track);
  const topic = getTopic(params.track, params.topic);
  if (!track || !topic) return { title: "Topic not found" };
  return {
    title: `${topic.title} · ${track.title} · Code Ladder`,
    description: topic.description,
  };
}

export default function TopicPage({ params }: { params: { track: string; topic: string } }) {
  const track = getTrack(params.track);
  const topic = getTopic(params.track, params.topic);
  if (!track || !topic) notFound();

  return (
    <TopicView
      trackId={track.id}
      trackTitle={track.title}
      lang={track.codeLang}
      refsLabel={track.refsLabel}
      topic={topic}
    />
  );
}
