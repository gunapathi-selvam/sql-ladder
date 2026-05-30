# 🧠 Code Ladder — Project Memory

> Read this before editing. It captures the **purpose, architecture, core logic, and conventions**
> so changes stay consistent. (Quick-start & feature list live in `README.md`; this file is the "why".)

---

## 1. Purpose

Code Ladder is a **static, no-backend learning site** for self-study practice across four languages
("tracks"): **SQL, HTML, CSS, JavaScript**. A learner picks a track, follows a roadmap, and works
through categorized questions (MCQ / short answer / code) with hints, explanations and solutions.
Everything — content and progress — works offline; progress is saved in the browser.

**Design goals:** one reusable UI for all tracks (only JSON content differs), an elegant calm theme,
and content that ladders from beginner basics up to advanced concepts.

---

## 2. Tech stack

- **Next.js 14 (App Router)** — fully static (SSG); every page is prerendered (`next build` → 41 pages).
- **TypeScript** + **Tailwind CSS**.
- **No database / API / external state.** Content = JSON files. Progress/theme/view-mode = `localStorage`.

---

## 3. Data model (the single source of truth)

One JSON file per track in `src/data/`: `sql.json`, `html.json`, `css.json`, `js.json`.
Each file is one **`Track`** object. Types are defined in [`src/lib/types.ts`](src/lib/types.ts).

```
Track {
  id, title, tagline, description, icon,
  codeLang: "sql"|"html"|"css"|"javascript",   // picks the syntax highlighter
  refsLabel: string,                            // label for question.tags ("Tables", "Elements"…)
  roadmap: RoadmapStage[],
  topics: Topic[]
}
RoadmapStage { id, title, blurb, level, topicIds[] }   // blurb = kid-friendly; topicIds deep-link to topics
Topic { id, title, description, icon, level: "beginner"|"intermediate"|"advanced", questions[] }
Question {
  id,                       // unique WITHIN THE TRACK (prefix per topic, e.g. bs-01)
  type: "mcq"|"single"|"code",
  difficulty: "easy"|"medium"|"hard",
  category: string,         // sub-group inside a topic — drives "View all" headings
  question, hint, explanation,
  options?: string[],       // mcq only
  answer?: string,          // mcq = correct LETTER ("B"); single = short text; absent for code
  code?: string,            // code only — the solution (NOT "sql")
  tags: string[]            // related refs; SQL=tables, others=elements/properties/APIs (NOT "schemaTables")
}
```

**Field-naming gotcha:** the generic fields are **`code`** and **`tags`** (the original SQL-only app
used `sql` and `schemaTables` — those names are gone). Don't reintroduce them.

**Categories currently in use:** `Core concepts`, `Applied practice`, `Advanced & scenarios`,
`Scenario challenges`, `Case & conditional logic`.

---

## 4. Core logic — where the important behaviour lives

| Concern | File | Notes |
|---|---|---|
| Load tracks, lookups, dashboard summaries | [`src/lib/data.ts`](src/lib/data.ts) | Imports all 4 JSONs. **Server-only** — never import from a client component (it would bundle every question into the client). |
| Pure category grouping | [`src/lib/group.ts`](src/lib/group.ts) | Client-safe (types only). Used by `TopicView` "View all" mode. |
| Progress + view mode (localStorage) | [`src/lib/progress.ts`](src/lib/progress.ts) | Keys below. Emits a `ll:progress` event so all components stay in sync. |
| Light/dark theme | [`src/lib/theme.tsx`](src/lib/theme.tsx) + FOUC script in `layout.tsx` | Light is default. |
| Syntax highlighter (sql/js/css/html) | [`src/lib/highlight.ts`](src/lib/highlight.ts) | Tiny regex-based, zero deps. `highlight(code, lang)`. |

**localStorage keys:** `ll-progress-v1` (map `"trackId/topicId" → {questionId: bool}`),
`ll-theme` (`"light"|"dark"`), `ll-view-mode` (`"focus"|"list"`). Bump the `-v1` suffix if the
progress shape ever changes.

---

## 5. Routing (App Router, `src/app/`)

```
/                                  page.tsx               Dashboard: track cards + compact roadmaps
/add                               add/page.tsx           Question JSON snippet generator (any track)
/learn/[track]                     learn/[track]/page.tsx Track landing: full roadmap + topics by level
/learn/[track]                     learn/[track]/layout.tsx  Validates track, sets .track-<id> accent wrapper
/learn/[track]/[topic]             .../[topic]/page.tsx   TopicView (questions)
/learn/[track]/answers             .../answers/page.tsx   Per-track answer sheet
```

- Each route has a sibling **`loading.tsx`** (skeleton) + a global **`RouteProgress`** top bar — together
  they make "loading vs. stable" obvious during navigation.
- `generateStaticParams` enumerates tracks/topics so all pages are static.
- Pages are **server components** that pass only the needed slice (one topic, or lightweight summaries)
  to client components — keeps the client bundle small.

---

## 6. Theming & the accent system (important for any UI edit)

- Light default, muted dark mode. Neutrals are **zinc**; background tokens are `paper` / `paper-dark`
  (see `tailwind.config.ts`).
- **One accent colour per track**, driven by a single CSS variable `--accent` (an `R G B` triplet).
  `.track-sql/.track-html/.track-css/.track-js` set it in [`globals.css`](src/app/globals.css);
  the `/learn/[track]/layout.tsx` wrapper applies the class so everything inside inherits it.
- Use the helper classes — **don't hardcode brand colours**: `bg-accent`, `text-accent`,
  `bg-accent-soft`, `border-accent`, `border-accent-soft`, `ring-accent`, `hover-accent`.
- Code blocks stay on a dark surface in both themes (the `.sql-*` highlight classes).

---

## 7. Components (all reusable / track-agnostic — `src/components/`)

`Navbar`, `ThemeToggle`, `RouteProgress`, `PageSkeleton`, `TrackCard`, `TopicCard`, `Roadmap`,
`TopicView` (+ `ViewToggle`), `QuestionCard`, `AnswerSheet`, `AddQuestionForm`, `CodeBlock`,
`Badges`, `ProgressBar`.

**Two view modes** live in `TopicView`:
- **Focus** — one question at a time, sidebar navigator, keyboard `H` hint / `A` answer / `←` `→` move.
- **View all** — every question stacked, grouped by `category`.
The choice persists via `useViewMode`.

---

## 8. How to make common edits safely

- **Add a question:** open `/add`, pick track+topic+category, copy the snippet into
  `src/data/<track>.json` inside that topic's `questions` array. Keep `id` unique within the track.
- **Add a topic:** append a `Topic` to a track's `topics[]`, give it a `level`, and add its `id` to a
  roadmap stage's `topicIds` so it appears on the roadmap.
- **Add a whole new track:** create `src/data/<id>.json`, add it to the array in `src/lib/data.ts`,
  add a `.track-<id>` accent rule in `globals.css`, and add it to the `TRACKS` list in `Navbar.tsx`.
- **Golden rules:**
  1. Never import `src/lib/data.ts` from a `"use client"` component (use props or `group.ts`).
  2. Use `code`/`tags` field names and the accent helper classes.
  3. After edits run `npx tsc --noEmit` and `npx next build` — both must be clean.

---

## 9. Content status & goal

As of last update: **621 questions** — SQL 350 (10 topics × 35), HTML 90, CSS 90, JS 91.
HTML/CSS/JS are **beginner + intermediate only**; SQL goes to **advanced**.
Intended direction: grow each section toward ~40 questions over time via the `/add` flow.
