export default function ProgressBar({
  value,
  max,
  showLabel = true,
}: {
  value: number;
  max: number;
  showLabel?: boolean;
}) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span>
            {value}/{max} done
          </span>
          <span>{pct}%</span>
        </div>
      )}
      <div
        className="mt-1 h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
      >
        <div
          className="bg-accent h-full rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
