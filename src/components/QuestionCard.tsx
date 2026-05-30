"use client";

import { useEffect, useState } from "react";
import type { Question } from "@/lib/types";
import type { CodeLang } from "@/lib/highlight";
import { TypeBadge, DifficultyBadge } from "./Badges";
import CodeBlock from "./CodeBlock";

interface Props {
  question: Question;
  index: number;
  total: number;
  done: boolean;
  onToggleDone: () => void;
  lang: CodeLang;
  refsLabel: string;
  /** Focus-mode keyboard triggers (omit in list mode). */
  revealSignal?: number;
  hintSignal?: number;
}

const LETTERS = ["A", "B", "C", "D", "E"];

export default function QuestionCard({
  question,
  index,
  total,
  done,
  onToggleDone,
  lang,
  refsLabel,
  revealSignal = 0,
  hintSignal = 0,
}: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setSelected(null);
    setShowAnswer(false);
    setShowHint(false);
  }, [question.id]);

  useEffect(() => {
    if (revealSignal > 0) setShowAnswer(true);
  }, [revealSignal]);

  useEffect(() => {
    if (hintSignal > 0) setShowHint((s) => !s);
  }, [hintSignal]);

  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
            Q{index + 1} / {total}
          </span>
          <TypeBadge type={question.type} />
          <DifficultyBadge difficulty={question.difficulty} />
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800"
            checked={done}
            onChange={onToggleDone}
          />
          Mark as done
        </label>
      </header>

      <h2 className="text-base font-semibold leading-relaxed text-zinc-900 sm:text-lg dark:text-zinc-100">
        {question.question}
      </h2>

      {question.tags && question.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
          <span>{refsLabel}:</span>
          {question.tags.map((t) => (
            <code
              key={t}
              className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              {t}
            </code>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShowHint((s) => !s)}
          className="rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 dark:border-amber-700/60 dark:bg-amber-900/20 dark:text-amber-200 dark:hover:bg-amber-900/40"
        >
          💡 {showHint ? "Hide hint" : "Show hint"}
        </button>

        {question.type !== "mcq" && (
          <button
            type="button"
            onClick={() => setShowAnswer((s) => !s)}
            className="border-accent-soft text-accent bg-accent-soft hover-accent rounded-md border px-3 py-1.5 text-xs font-semibold"
          >
            🔓 {showAnswer ? "Hide answer" : "Reveal answer"}
          </button>
        )}
      </div>

      {showHint && (
        <div className="mt-3 animate-fade-in rounded-md border-l-4 border-amber-400 bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-900/20 dark:text-amber-100">
          {question.hint}
        </div>
      )}

      {question.type === "mcq" && question.options && (
        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {question.options.map((opt, i) => {
            const letter = LETTERS[i];
            const isCorrect = letter === question.answer;
            const isPicked = selected === letter;
            const reveal = selected !== null;

            let cls =
              "flex items-start gap-3 rounded-lg border p-3 text-left text-sm transition-colors ";
            if (!reveal) {
              cls +=
                "border-zinc-200 bg-white hover-accent dark:border-zinc-700 dark:bg-zinc-900";
            } else if (isCorrect) {
              cls +=
                "border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-900/30";
            } else if (isPicked) {
              cls += "border-rose-500 bg-rose-50 dark:border-rose-500 dark:bg-rose-900/30";
            } else {
              cls += "border-zinc-200 bg-white opacity-60 dark:border-zinc-800 dark:bg-zinc-900";
            }

            return (
              <button
                key={letter}
                type="button"
                onClick={() => setSelected(letter)}
                disabled={reveal}
                className={cls}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                  {letter}
                </span>
                <span className="text-zinc-800 dark:text-zinc-100">{opt}</span>
              </button>
            );
          })}
        </div>
      )}

      {question.type === "mcq" && selected !== null && (
        <div className="bg-accent-soft border-accent mt-4 animate-fade-in rounded-md border-l-4 p-3 text-sm">
          <p className="text-accent font-semibold">
            {selected === question.answer
              ? "✅ Correct!"
              : `❌ Not quite — the correct answer is ${question.answer}.`}
          </p>
          <p className="mt-1 text-zinc-700 dark:text-zinc-200">{question.explanation}</p>
        </div>
      )}

      {question.type === "single" && showAnswer && (
        <div className="mt-4 animate-fade-in space-y-3">
          <div className="rounded-md border-l-4 border-emerald-500 bg-emerald-50 p-3 dark:bg-emerald-900/20">
            <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              Answer
            </div>
            <div className="mt-1 font-mono text-base text-emerald-900 dark:text-emerald-100">
              {question.answer}
            </div>
          </div>
          <div className="rounded-md border-l-4 border-zinc-400 bg-zinc-50 p-3 text-sm text-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-200">
            {question.explanation}
          </div>
        </div>
      )}

      {question.type === "code" && showAnswer && question.code && (
        <div className="mt-4 animate-fade-in space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">
            Solution
          </div>
          <CodeBlock code={question.code} lang={lang} />
          <div className="rounded-md border-l-4 border-zinc-400 bg-zinc-50 p-3 text-sm text-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-200">
            {question.explanation}
          </div>
        </div>
      )}
    </article>
  );
}
