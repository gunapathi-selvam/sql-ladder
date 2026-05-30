"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

// Static so the navbar never pulls question data into the client bundle.
const TRACKS = [
  { id: "sql", title: "SQL", icon: "🗄️" },
  { id: "html", title: "HTML", icon: "📄" },
  { id: "css", title: "CSS", icon: "🎨" },
  { id: "js", title: "JavaScript", icon: "⚡" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isTrack = (id: string) => pathname.startsWith(`/learn/${id}`);

  return (
    <header className="no-print sticky top-0 z-40 border-b border-zinc-200 bg-paper/80 backdrop-blur dark:border-zinc-800 dark:bg-paper-dark/80">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="text-xl" aria-hidden>🪜</span>
          <span className="text-base font-semibold tracking-tight sm:text-lg">Code Ladder</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {TRACKS.map((t) => (
            <Link
              key={t.id}
              href={`/learn/${t.id}`}
              className={`track-${t.id} rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                isTrack(t.id)
                  ? "bg-accent-soft text-accent"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              <span className="mr-1" aria-hidden>{t.icon}</span>
              {t.title}
            </Link>
          ))}
          <Link
            href="/add"
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              pathname === "/add"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            }`}
          >
            Add
          </Link>
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
            className="rounded-md p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {open ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-zinc-200 px-4 py-2 md:hidden dark:border-zinc-800">
          {TRACKS.map((t) => (
            <Link
              key={t.id}
              href={`/learn/${t.id}`}
              onClick={() => setOpen(false)}
              className={`track-${t.id} block rounded-md px-3 py-2 text-sm font-medium ${
                isTrack(t.id)
                  ? "bg-accent-soft text-accent"
                  : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              <span className="mr-1" aria-hidden>{t.icon}</span>
              {t.title}
            </Link>
          ))}
          <Link
            href="/add"
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Add a question
          </Link>
        </nav>
      )}
    </header>
  );
}
