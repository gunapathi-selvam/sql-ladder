"use client";

import { useMemo, useState } from "react";
import type { Difficulty, QuestionType } from "@/lib/types";

export interface TrackMeta {
  id: string;
  title: string;
  refsLabel: string;
  topics: { id: string; title: string; categories: string[] }[];
}

export default function AddQuestionForm({ tracks }: { tracks: TrackMeta[] }) {
  const [trackId, setTrackId] = useState(tracks[0]?.id ?? "");
  const track = tracks.find((t) => t.id === trackId) ?? tracks[0];
  const [topicId, setTopicId] = useState(track?.topics[0]?.id ?? "");
  const topic = track?.topics.find((t) => t.id === topicId) ?? track?.topics[0];

  const [id, setId] = useState("new-01");
  const [type, setType] = useState<QuestionType>("mcq");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [category, setCategory] = useState("Core concepts");
  const [question, setQuestion] = useState("");
  const [hint, setHint] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [answer, setAnswer] = useState("");
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [tags, setTags] = useState("");
  const [copied, setCopied] = useState(false);

  const snippet = useMemo(() => {
    const obj: Record<string, unknown> = { id: id || "new-01", type, difficulty, category, question, hint };
    if (type === "mcq") {
      obj.options = options;
      obj.answer = answer;
    } else if (type === "single") {
      obj.answer = answer;
    } else if (type === "code") {
      obj.code = code;
    }
    obj.explanation = explanation;
    obj.tags = tags.split(",").map((s) => s.trim()).filter(Boolean);
    return JSON.stringify(obj, null, 2);
  }, [id, type, difficulty, category, question, hint, options, answer, code, explanation, tags]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const inputCls =
    "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-accent focus:ring-accent focus:ring-1 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100";
  const labelCls = "block text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400";

  const onTrackChange = (newId: string) => {
    setTrackId(newId);
    const nt = tracks.find((t) => t.id === newId);
    setTopicId(nt?.topics[0]?.id ?? "");
  };

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">✍️ Add a question</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          Fill in the form to generate a JSON snippet, then paste it into{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs dark:bg-zinc-800">
            src/data/{trackId}.json
          </code>{" "}
          inside the chosen topic&apos;s <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs dark:bg-zinc-800">questions</code> array.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <form className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Track</label>
              <select className={inputCls + " mt-1"} value={trackId} onChange={(e) => onTrackChange(e.target.value)}>
                {tracks.map((t) => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Topic</label>
              <select className={inputCls + " mt-1"} value={topicId} onChange={(e) => setTopicId(e.target.value)}>
                {track?.topics.map((t) => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Question id (unique within track)</label>
              <input className={inputCls + " mt-1 font-mono"} value={id} onChange={(e) => setId(e.target.value)} placeholder="e.g. bs-41" />
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <input
                className={inputCls + " mt-1"}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                list="category-list"
                placeholder="Core concepts"
              />
              <datalist id="category-list">
                {topic?.categories.map((c) => <option key={c} value={c} />)}
              </datalist>
            </div>
            <div>
              <label className={labelCls}>Type</label>
              <select className={inputCls + " mt-1"} value={type} onChange={(e) => setType(e.target.value as QuestionType)}>
                <option value="mcq">MCQ</option>
                <option value="single">Single answer</option>
                <option value="code">Code</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Difficulty</label>
              <select className={inputCls + " mt-1"} value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)}>
                <option value="easy">easy</option>
                <option value="medium">medium</option>
                <option value="hard">hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Question</label>
            <textarea className={inputCls + " mt-1"} rows={3} value={question} onChange={(e) => setQuestion(e.target.value)} />
          </div>

          <div>
            <label className={labelCls}>Hint</label>
            <input className={inputCls + " mt-1"} value={hint} onChange={(e) => setHint(e.target.value)} />
          </div>

          {type === "mcq" && (
            <div>
              <label className={labelCls}>Options (A–D)</label>
              <div className="mt-1 space-y-2">
                {options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-5 text-center font-bold text-zinc-500">{String.fromCharCode(65 + i)}</span>
                    <input
                      className={inputCls}
                      value={opt}
                      onChange={(e) => setOptions((arr) => arr.map((v, idx) => (idx === i ? e.target.value : v)))}
                      placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    />
                  </div>
                ))}
              </div>
              <label className={labelCls + " mt-3"}>Correct letter</label>
              <input className={inputCls + " mt-1 w-24 font-mono"} value={answer} onChange={(e) => setAnswer(e.target.value.toUpperCase())} maxLength={1} placeholder="B" />
            </div>
          )}

          {type === "single" && (
            <div>
              <label className={labelCls}>Answer (short text)</label>
              <input className={inputCls + " mt-1 font-mono"} value={answer} onChange={(e) => setAnswer(e.target.value)} />
            </div>
          )}

          {type === "code" && (
            <div>
              <label className={labelCls}>Code solution</label>
              <textarea className={inputCls + " mt-1 font-mono"} rows={5} value={code} onChange={(e) => setCode(e.target.value)} />
            </div>
          )}

          <div>
            <label className={labelCls}>Explanation</label>
            <textarea className={inputCls + " mt-1"} rows={3} value={explanation} onChange={(e) => setExplanation(e.target.value)} />
          </div>

          <div>
            <label className={labelCls}>{track?.refsLabel ?? "Tags"} (comma separated)</label>
            <input className={inputCls + " mt-1 font-mono"} value={tags} onChange={(e) => setTags(e.target.value)} placeholder="actor, film" />
          </div>
        </form>

        <aside className="space-y-3 rounded-xl border border-zinc-200 bg-white p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Generated JSON</h2>
            <button type="button" onClick={onCopy} className="bg-accent rounded-md px-3 py-1.5 text-xs font-semibold">
              {copied ? "Copied!" : "Copy JSON snippet"}
            </button>
          </div>
          <pre className="code-scroll max-h-[60vh] overflow-auto rounded-lg border border-zinc-800 bg-zinc-900 p-4 font-mono text-xs leading-relaxed text-zinc-100">
{snippet}
          </pre>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Paste into{" "}
            <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">src/data/{trackId}.json</code>{" "}
            inside topic <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">{topicId}</code>.
          </p>
        </aside>
      </div>
    </div>
  );
}
