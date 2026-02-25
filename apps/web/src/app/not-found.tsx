import Link from "next/link";

export default function NotFound() {
  return (
    <div className="glass mx-auto max-w-xl rounded-2xl p-8 text-center">
      <h1 className="text-2xl font-bold">Page Not Found</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">The page you requested does not exist.</p>
      <Link href="/" className="mt-4 inline-block rounded-xl bg-emeraldGlow-500 px-4 py-2 text-sm font-semibold text-white">
        Return Home
      </Link>
    </div>
  );
}
