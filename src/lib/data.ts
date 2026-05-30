import type { Track, Topic, Level } from "./types";
import sql from "@/data/sql.json";
import html from "@/data/html.json";
import css from "@/data/css.json";
import js from "@/data/js.json";

export const tracks: Track[] = [sql, html, css, js] as Track[];

export function getTrack(id: string): Track | undefined {
  return tracks.find((t) => t.id === id);
}

export function getTopic(trackId: string, topicId: string): Topic | undefined {
  return getTrack(trackId)?.topics.find((t) => t.id === topicId);
}

export function trackQuestionCount(track: Track): number {
  return track.topics.reduce((sum, t) => sum + t.questions.length, 0);
}

/** Lightweight per-track summary for the dashboard — avoids passing all questions to the client. */
export interface TrackSummary {
  id: string;
  title: string;
  tagline: string;
  icon: string;
  topicCount: number;
  questionCount: number;
  levels: Level[];
}

export function trackSummaries(): TrackSummary[] {
  return tracks.map((t) => ({
    id: t.id,
    title: t.title,
    tagline: t.tagline,
    icon: t.icon,
    topicCount: t.topics.length,
    questionCount: trackQuestionCount(t),
    levels: Array.from(new Set(t.topics.map((tp) => tp.level))),
  }));
}
