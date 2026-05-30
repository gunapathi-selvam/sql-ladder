"use client";

import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "ll-progress-v1";
const PROGRESS_EVENT = "ll:progress";

/** Map of "trackId/topicId" -> { questionId: done }. */
type ProgressMap = Record<string, Record<string, boolean>>;

const keyOf = (trackId: string, topicId: string) => `${trackId}/${topicId}`;

function readAll(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

function writeAll(map: ProgressMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  window.dispatchEvent(new CustomEvent(PROGRESS_EVENT));
}

export function useTopicProgress(trackId: string, topicId: string) {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const k = keyOf(trackId, topicId);

  useEffect(() => {
    setDone(readAll()[k] ?? {});
  }, [k]);

  const toggle = useCallback(
    (questionId: string) => {
      setDone((prev) => {
        const next = { ...prev, [questionId]: !prev[questionId] };
        const all = readAll();
        all[k] = next;
        writeAll(all);
        return next;
      });
    },
    [k]
  );

  return { done, toggle };
}

/** Live snapshot of the whole progress map, refreshed across tabs and components. */
export function useAllProgress(): ProgressMap {
  const [map, setMap] = useState<ProgressMap>({});

  useEffect(() => {
    const refresh = () => setMap(readAll());
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener(PROGRESS_EVENT, refresh as EventListener);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(PROGRESS_EVENT, refresh as EventListener);
    };
  }, []);

  return map;
}

export function countDone(map: ProgressMap, trackId: string, topicId: string): number {
  const t = map[keyOf(trackId, topicId)];
  return t ? Object.values(t).filter(Boolean).length : 0;
}

/** Total completed questions across all topics of a track. */
export function countTrackDone(map: ProgressMap, trackId: string): number {
  return Object.entries(map)
    .filter(([key]) => key.startsWith(`${trackId}/`))
    .reduce((sum, [, qs]) => sum + Object.values(qs).filter(Boolean).length, 0);
}

/** Persisted question-list view mode: "focus" (one-by-one) or "list" (all at once). */
export type ViewMode = "focus" | "list";
const VIEW_KEY = "ll-view-mode";

export function useViewMode(): [ViewMode, (m: ViewMode) => void] {
  const [mode, setMode] = useState<ViewMode>("focus");

  useEffect(() => {
    const stored = window.localStorage.getItem(VIEW_KEY) as ViewMode | null;
    if (stored === "focus" || stored === "list") setMode(stored);
  }, []);

  const update = useCallback((m: ViewMode) => {
    setMode(m);
    window.localStorage.setItem(VIEW_KEY, m);
  }, []);

  return [mode, update];
}
