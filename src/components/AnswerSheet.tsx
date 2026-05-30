"use client";

import { useState } from "react";
import Link from "next/link";
import type { Track } from "@/lib/types";
import { TypeBadge } from "./Badges";

export default function AnswerSheet({ track }: { track: Track }) {
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(track.topics.map((t) => [t.id, true]))
  );

  const toggle = (id: string) => setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  const setAll = (val: boolean) =>
    setOpen(Object.fromEntries(track.topics.map((t) => [t.id, val])));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div>
          <Link
            href={`/learn/${track.id}`}
            className="text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            ← {track.title} topics
          </Link>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            📋 {track.title} Answer Sheet
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Every answer, grouped by topic. Print-friendly.
          </p>
        </div>
        <div className="no-print flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setAll(true)}
            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Expand all
          </button>
          <button
            type="button"
            onClick={() => setAll(false)}
            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Collapse all
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="bg-accent rounded-md px-3 py-1.5 text-xs font-semibold"
          >
            🖨 Print
          </button>
        </div>
      </header>

      <div className="space-y-4">
        {track.topics.map((t) => (
          <section
            key={t.id}
            className="print-card overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
          >
            <button
              type="button"
              onClick={() => toggle(t.id)}
              className="flex w-full items-center justify-between gap-3 px-5 py-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            >
              <span className="flex items-center gap-3">
                <span className="text-xl" aria-hidden>{t.icon}</span>
                <span className="text-base font-semibold sm:text-lg">{t.title}</span>
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  {t.questions.length} Qs
                </span>
              </span>
              <span className="text-zinc-400">{open[t.id] ? "−" : "+"}</span>
            </button>

            {open[t.id] && (
              <div className="overflow-x-auto border-t border-zinc-200 dark:border-zinc-800">
                <table className="w-full min-w-[640px] border-collapse text-sm">
                  <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-800/50 dark:text-zinc-400">
                    <tr>
                      <th className="px-3 py-2">Q#</th>
                      <th className="px-3 py-2">Type</th>
                      <th className="px-3 py-2">Question</th>
                      <th className="px-3 py-2">Answer / Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    {t.questions.map((q, i) => (
                      <tr key={q.id} className="border-t border-zinc-100 align-top dark:border-zinc-800">
                        <td className="px-3 py-2 font-mono text-xs text-zinc-500">{i + 1}</td>
                        <td className="px-3 py-2"><TypeBadge type={q.type} /></td>
                        <td className="px-3 py-2 text-zinc-700 dark:text-zinc-200">{q.question}</td>
                        <td className="px-3 py-2 font-mono text-xs text-zinc-800 dark:text-zinc-100">
                          {q.type === "code" ? (
                            <pre className="code-scroll whitespace-pre-wrap break-words rounded bg-zinc-100 p-2 dark:bg-zinc-800">{q.code}</pre>
                          ) : (
                            <span>{q.answer}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
