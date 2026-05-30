import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <p className="text-6xl">🤷</p>
      <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        That link doesn&apos;t map to a track or topic here.
      </p>
      <Link
        href="/"
        className="bg-accent mt-6 inline-block rounded-md px-4 py-2 text-sm font-semibold"
      >
        Back to home
      </Link>
    </div>
  );
}
