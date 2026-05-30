import type { Difficulty, QuestionType, Level } from "@/lib/types";
import { LEVEL_LABEL } from "@/lib/types";

const typeStyle: Record<QuestionType, string> = {
  mcq: "bg-sky-500/10 text-sky-700 ring-sky-500/25 dark:text-sky-300",
  single: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/25 dark:text-emerald-300",
  code: "bg-violet-500/10 text-violet-700 ring-violet-500/25 dark:text-violet-300",
};

const typeLabel: Record<QuestionType, string> = {
  mcq: "MCQ",
  single: "Single",
  code: "Code",
};

export function TypeBadge({ type }: { type: QuestionType }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${typeStyle[type]}`}
    >
      {typeLabel[type]}
    </span>
  );
}

const diffStyle: Record<Difficulty, string> = {
  easy: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/25 dark:text-emerald-300",
  medium: "bg-amber-500/10 text-amber-700 ring-amber-500/25 dark:text-amber-300",
  hard: "bg-rose-500/10 text-rose-700 ring-rose-500/25 dark:text-rose-300",
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset ${diffStyle[difficulty]}`}
    >
      {difficulty}
    </span>
  );
}

const levelStyle: Record<Level, string> = {
  beginner: "bg-emerald-500/10 text-emerald-700 ring-emerald-500/25 dark:text-emerald-300",
  intermediate: "bg-sky-500/10 text-sky-700 ring-sky-500/25 dark:text-sky-300",
  advanced: "bg-violet-500/10 text-violet-700 ring-violet-500/25 dark:text-violet-300",
};

export function LevelBadge({ level }: { level: Level }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${levelStyle[level]}`}
    >
      {LEVEL_LABEL[level]}
    </span>
  );
}

export const typeColorDot: Record<QuestionType, string> = {
  mcq: "bg-sky-500",
  single: "bg-emerald-500",
  code: "bg-violet-500",
};
