import { notFound } from "next/navigation";
import { getTrack, tracks } from "@/lib/data";
import AnswerSheet from "@/components/AnswerSheet";

export function generateStaticParams() {
  return tracks.map((t) => ({ track: t.id }));
}

export function generateMetadata({ params }: { params: { track: string } }) {
  const track = getTrack(params.track);
  if (!track) return { title: "Answers not found" };
  return { title: `${track.title} Answers · Code Ladder` };
}

export default function AnswersPage({ params }: { params: { track: string } }) {
  const track = getTrack(params.track);
  if (!track) notFound();
  return <AnswerSheet track={track} />;
}
