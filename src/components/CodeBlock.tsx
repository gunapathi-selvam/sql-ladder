"use client";

import { useState } from "react";
import { highlight, type CodeLang } from "@/lib/highlight";

export default function CodeBlock({
  code,
  lang = "sql",
}: {
  code: string;
  lang?: CodeLang;
}) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard may be unavailable in insecure contexts; fail silently
    }
  };

  return (
    <div className="relative">
      <pre
        className="code-scroll overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900 p-4 font-mono text-sm leading-relaxed text-zinc-100 print:border print:bg-white print:text-black"
        aria-label="Code solution"
      >
        <code dangerouslySetInnerHTML={{ __html: highlight(code, lang) }} />
      </pre>
      <button
        type="button"
        onClick={onCopy}
        className="no-print absolute right-2 top-2 rounded-md border border-zinc-700 bg-zinc-800/80 px-2 py-1 text-xs font-medium text-zinc-200 backdrop-blur hover:bg-zinc-700"
        aria-label="Copy code"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
