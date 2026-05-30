# Code Ladder 🪜

A calm, self-study practice platform for **SQL, HTML, CSS and JavaScript**. Each language is a "track" with its own roadmap, topics (split into categories), and hundreds of questions — MCQ, short answer and full code — with hints, explanations and worked solutions. Next.js 14 (App Router) + TypeScript + Tailwind. No backend; all content lives in per-track JSON files and progress is stored in the browser.

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Deploy to Vercel

Push to a Git repository, import the repo in Vercel, accept defaults. No env vars required — the whole site is statically generated.

## Features

- **Four tracks** — SQL (Sakila DB), HTML, CSS, JavaScript. Reusable UI; only the JSON content differs.
- **Roadmaps** — every track has a staged roadmap (beginner → advanced) on its landing page, plus compact roadmaps on the dashboard. Each step deep-links into the topic to start learning.
- **Categories** — each topic's questions are grouped into categories (Core concepts, Applied practice, Scenario challenges, Case & conditional logic, …).
- **Two view modes** — *Focus* (one question at a time with a navigator + keyboard shortcuts) and *View all* (every question listed top-to-bottom by category). Your choice is remembered.
- **Progress tracking** — per-track / per-topic completion stored in `localStorage` and reflected in progress bars across the app.
- **Elegant, light-default theme** with a muted dark mode and a distinct accent colour per track (driven by a single `--accent` CSS variable).

> 🧠 **Editing the project?** Read [`MEMORY.md`](MEMORY.md) first — it documents the architecture,
> core logic, data model, theming/accent system and the rules for safe edits.

## Project layout

```
src/
├── app/
│   ├── layout.tsx                          # Root layout, theme + nav
│   ├── page.tsx                            # Dashboard: track cards + roadmaps
│   ├── learn/[track]/layout.tsx            # Sets per-track accent, validates track
│   ├── learn/[track]/page.tsx              # Track landing: roadmap + topics by level
│   ├── learn/[track]/[topic]/page.tsx      # Topic questions (TopicView)
│   ├── learn/[track]/answers/page.tsx      # Per-track answer sheet
│   ├── add/page.tsx                        # JSON snippet generator
│   ├── not-found.tsx
│   └── globals.css
├── components/                             # All reusable, track-agnostic
│   ├── Navbar.tsx, ThemeToggle.tsx
│   ├── TrackCard.tsx, TopicCard.tsx, Roadmap.tsx
│   ├── TopicView.tsx, ViewToggle.tsx, QuestionCard.tsx
│   ├── AnswerSheet.tsx, AddQuestionForm.tsx
│   ├── CodeBlock.tsx, Badges.tsx, ProgressBar.tsx
├── lib/
│   ├── types.ts          # Track / Topic / Question / RoadmapStage
│   ├── data.ts           # loads the 4 track JSONs, summaries, lookups
│   ├── group.ts          # pure groupByCategory (client-safe)
│   ├── progress.ts       # localStorage hooks (progress + view mode)
│   ├── theme.tsx         # light/dark context (light default)
│   └── highlight.ts      # tiny SQL/JS/CSS/HTML syntax highlighter
└── data/
    ├── sql.json  html.json  css.json  js.json    # one Track per file
```

## Adding content

- **A question:** open `/add`, choose track + topic + category, fill the form, *Copy JSON snippet*, then paste the object into `src/data/<track>.json` inside the topic's `questions` array.
- **A topic:** append a `Topic` object (`id`, `title`, `description`, `icon`, `level`, `questions`) to a track's `topics` array, and reference its id from a roadmap stage's `topicIds`.

## Keyboard shortcuts (Focus mode)

| Key | Action |
| --- | --- |
| `H` | Toggle hint |
| `A` | Reveal answer / code solution |
| `N` or `→` | Next question |
| `←` | Previous question |
