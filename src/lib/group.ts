import type { Question } from "./types";

/** Group questions by their `category`, preserving first-seen order. Pure — safe for client bundles. */
export function groupByCategory(questions: Question[]) {
  const groups = new Map<string, Question[]>();
  for (const q of questions) {
    const list = groups.get(q.category) ?? [];
    list.push(q);
    groups.set(q.category, list);
  }
  return Array.from(groups, ([category, items]) => ({ category, questions: items }));
}
