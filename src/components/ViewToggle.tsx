"use client";

import type { ViewMode } from "@/lib/progress";

const options: { value: ViewMode; label: string; icon: string }[] = [
  { value: "focus", label: "Focus", icon: "▦" },
  { value: "list", label: "View all", icon: "☰" },
];

export default function ViewToggle({
  mode,
  onChange,
}: {
  mode: ViewMode;
  onChange: (m: ViewMode) => void;
}) {
  return (
    <div
      className="inline-flex rounded-lg border border-zinc-200 bg-white p-0.5 text-sm dark:border-zinc-800 dark:bg-zinc-900"
      role="group"
      aria-label="View mode"
    >
      {options.map((o) => {
        const active = mode === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            className={`rounded-md px-3 py-1 font-medium transition-colors ${
              active
                ? "bg-accent"
                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            }`}
          >
            <span className="mr-1" aria-hidden>
              {o.icon}
            </span>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
