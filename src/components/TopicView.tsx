"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Topic } from "@/lib/types";
import type { CodeLang } from "@/lib/highlight";
import QuestionCard from "./QuestionCard";
import ProgressBar from "./ProgressBar";
import ViewToggle from "./ViewToggle";
import { LevelBadge, typeColorDot } from "./Badges";
import { useTopicProgress, useViewMode } from "@/lib/progress";
import { groupByCategory } from "@/lib/group";

interface Props {
  trackId: string;
  trackTitle: string;
  lang: CodeLang;
  refsLabel: string;
  topic: Topic;
}

export default function TopicView({ trackId, trackTitle, lang, refsLabel, topic }: Props) {
  const [current, setCurrent] = useState(0);
  const [viewMode, setViewMode] = useViewMode();
  const { done, toggle } = useTopicProgress(trackId, topic.id);
  const total = topic.questions.length;
  const doneCount = useMemo(() => Object.values(done).filter(Boolean).length, [done]);
  const groups = useMemo(() => groupByCategory(topic.questions), [topic.questions]);

  const [revealSignal, setRevealSignal] = useState(0);
  const [hintSignal, setHintSignal] = useState(0);

  const goNext = useCallback(() => setCurrent((c) => Math.min(total - 1, c + 1)), [total]);
  const goPrev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), []);

  // Focus-mode keyboard shortcuts: H, A, N + arrows
  useEffect(() => {
    if (viewMode !== "focus") return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === "h") {
        e.preventDefault();
        setHintSignal((s) => s + 1);
      } else if (k === "a") {
        e.preventDefault();
        setRevealSignal((s) => s + 1);
      } else if (k === "n" || e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, viewMode]);

  const q = topic.questions[current];

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link
              href={`/learn/${trackId}`}
              className="text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              ← {trackTitle} topics
            </Link>
            <h1 className="mt-1 flex items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl">
              <span aria-hidden>{topic.icon}</span>
              {topic.title}
            </h1>
            <p className="mt-1 max-w-3xl text-sm text-zinc-600 dark:text-zinc-300">
              {topic.description}
            </p>
            <div className="mt-2">
              <LevelBadge level={topic.level} />
            </div>
          </div>
          <div className="min-w-[180px] flex-1 sm:max-w-xs">
            <ProgressBar value={doneCount} max={total} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <ViewToggle mode={viewMode} onChange={setViewMode} />
          {viewMode === "focus" && (
            <div className="hidden flex-wrap items-center gap-3 text-xs text-zinc-500 sm:flex dark:text-zinc-400">
              <span className="font-semibold uppercase tracking-wide">Keys:</span>
              <kbd className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono dark:bg-zinc-800">H</kbd> hint
              <kbd className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono dark:bg-zinc-800">A</kbd> answer
              <kbd className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono dark:bg-zinc-800">←</kbd>
              <kbd className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono dark:bg-zinc-800">→</kbd> move
            </div>
          )}
        </div>
      </header>

      {viewMode === "focus" ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="px-1 pb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Questions
              </h3>
              <ol className="grid max-h-[60vh] grid-cols-5 gap-1.5 overflow-y-auto lg:max-h-[70vh] lg:grid-cols-4">
                {topic.questions.map((qq, i) => {
                  const isActive = i === current;
                  const isDone = !!done[qq.id];
                  return (
                    <li key={qq.id}>
                      <button
                        type="button"
                        onClick={() => setCurrent(i)}
                        className={`relative flex h-10 w-full items-center justify-center rounded-md text-xs font-bold transition-colors ${
                          isActive
                            ? "bg-accent"
                            : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                        }`}
                        title={`Q${i + 1} · ${qq.type}`}
                      >
                        {i + 1}
                        <span
                          className={`absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-zinc-900 ${typeColorDot[qq.type]}`}
                          aria-hidden
                        />
                        {isDone && (
                          <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-bold text-white ring-2 ring-white dark:ring-zinc-900">
                            ✓
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ol>

              <div className="mt-3 space-y-1.5 border-t border-zinc-100 px-1 pt-3 text-[11px] text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-sky-500" /> MCQ</div>
                <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Single</div>
                <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-violet-500" /> Code</div>
              </div>
            </div>
          </aside>

          <section className="space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-accent">
              {q.category}
            </div>
            <QuestionCard
              question={q}
              index={current}
              total={total}
              done={!!done[q.id]}
              onToggleDone={() => toggle(q.id)}
              lang={lang}
              refsLabel={refsLabel}
              revealSignal={revealSignal}
              hintSignal={hintSignal}
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={goPrev}
                disabled={current === 0}
                className="inline-flex items-center gap-1 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                ← Previous
              </button>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {current + 1} of {total}
              </span>
              <button
                type="button"
                onClick={goNext}
                disabled={current === total - 1}
                className="bg-accent inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-semibold shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          </section>
        </div>
      ) : (
        <div className="space-y-10">
          {groups.map(({ category, questions }) => (
            <section key={category} className="space-y-4">
              <h2 className="flex items-center gap-2 border-b border-zinc-200 pb-2 text-lg font-bold tracking-tight dark:border-zinc-800">
                <span className="text-accent">{category}</span>
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                  {questions.length}
                </span>
              </h2>
              {questions.map((qq) => {
                const idx = topic.questions.indexOf(qq);
                return (
                  <QuestionCard
                    key={qq.id}
                    question={qq}
                    index={idx}
                    total={total}
                    done={!!done[qq.id]}
                    onToggleDone={() => toggle(qq.id)}
                    lang={lang}
                    refsLabel={refsLabel}
                  />
                );
              })}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
