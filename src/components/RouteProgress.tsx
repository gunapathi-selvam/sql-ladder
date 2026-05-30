"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Lightweight top progress bar (no dependencies). It starts when an internal
 * link is clicked and completes once the new route commits (pathname change),
 * giving a clear "loading vs. stable" signal during navigation/redirects.
 */
export default function RouteProgress() {
  const pathname = usePathname();
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstRender = useRef(true);

  const clearTimers = () => {
    if (tickRef.current) clearInterval(tickRef.current);
    if (hideRef.current) clearTimeout(hideRef.current);
    tickRef.current = null;
    hideRef.current = null;
  };

  const start = () => {
    clearTimers();
    setVisible(true);
    setWidth(12);
    // Creep towards 90% so the bar feels alive while the route loads.
    tickRef.current = setInterval(() => {
      setWidth((w) => (w < 90 ? w + (90 - w) * 0.18 : w));
    }, 200);
  };

  const finish = () => {
    clearTimers();
    setWidth(100);
    hideRef.current = setTimeout(() => {
      setVisible(false);
      setWidth(0);
    }, 280);
  };

  // Start the bar on internal link clicks.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      const anchor = (e.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download")
      )
        return;
      if (href === pathname) return; // same page, no navigation
      start();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [pathname]);

  // Complete the bar whenever the route actually changes.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    finish();
    return clearTimers;
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="no-print fixed inset-x-0 top-0 z-[60] h-0.5" aria-hidden>
      <div
        className="bg-accent h-full shadow-[0_0_8px_rgb(var(--accent))] transition-[width] duration-200 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
