const bar = "rounded-md bg-zinc-200 dark:bg-zinc-800";

function Bar({ className = "" }: { className?: string }) {
  return <div className={`${bar} ${className}`} />;
}

function Card() {
  return (
    <div className="space-y-3 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <Bar className="h-8 w-8" />
      <Bar className="h-5 w-3/4" />
      <Bar className="h-4 w-full" />
      <Bar className="h-2 w-full" />
    </div>
  );
}

/**
 * Animated placeholder shown via route-level loading.tsx while a page streams in.
 * `variant` roughly matches the layout of the destination route.
 */
export default function PageSkeleton({
  variant = "grid",
}: {
  variant?: "grid" | "topic" | "list";
}) {
  return (
    <div className="animate-pulse space-y-8" aria-busy aria-label="Loading">
      <div className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-10 dark:border-zinc-800 dark:bg-zinc-900">
        <Bar className="h-4 w-24" />
        <Bar className="h-9 w-2/3" />
        <Bar className="h-4 w-full max-w-xl" />
      </div>

      {variant === "grid" && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} />
          ))}
        </div>
      )}

      {variant === "list" && (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Bar key={i} className="h-14 w-full" />
          ))}
        </div>
      )}

      {variant === "topic" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          <Bar className="hidden h-72 w-full lg:block" />
          <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <Bar className="h-5 w-40" />
            <Bar className="h-6 w-3/4" />
            <Bar className="h-32 w-full" />
            <Bar className="h-10 w-full" />
          </div>
        </div>
      )}
    </div>
  );
}
