export type QuestionType = "mcq" | "single" | "code";
export type Difficulty = "easy" | "medium" | "hard";
export type Level = "beginner" | "intermediate" | "advanced";

export interface Question {
  id: string;
  type: QuestionType;
  difficulty: Difficulty;
  /** Sub-grouping within a topic, e.g. "Core concepts", "Scenario challenges". */
  category: string;
  question: string;
  hint: string;
  options?: string[];
  /** Correct option letter ("A"–"E") for mcq, or short text for single. */
  answer?: string;
  /** Full code solution for `code` questions (SQL / HTML / CSS / JS). */
  code?: string;
  explanation: string;
  /** Related references — SQL tables, HTML elements, CSS properties, JS APIs. */
  tags: string[];
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  level: Level;
  questions: Question[];
}

export interface RoadmapStage {
  id: string;
  title: string;
  /** Friendly, kid-readable description of what you learn in this stage. */
  blurb: string;
  level: Level;
  /** Topic ids this stage links to, in suggested study order. */
  topicIds: string[];
}

export interface Track {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  /** Language key for the syntax highlighter. */
  codeLang: "sql" | "html" | "css" | "javascript";
  /** Label for a question's `tags` (e.g. "Tables", "Elements", "Properties"). */
  refsLabel: string;
  roadmap: RoadmapStage[];
  topics: Topic[];
}

export const LEVEL_ORDER: Level[] = ["beginner", "intermediate", "advanced"];

export const LEVEL_LABEL: Record<Level, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};
