import { notFound } from "next/navigation";
import { getTrack, tracks } from "@/lib/data";

export function generateStaticParams() {
  return tracks.map((t) => ({ track: t.id }));
}

export default function TrackLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { track: string };
}) {
  if (!getTrack(params.track)) notFound();
  // The track-* class drives the --accent CSS variable for everything inside.
  return <div className={`track-${params.track}`}>{children}</div>;
}
