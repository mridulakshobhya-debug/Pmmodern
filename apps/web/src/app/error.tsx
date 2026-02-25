"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="glass mx-auto mt-20 max-w-2xl rounded-2xl p-8 text-center">
      <h2 className="text-2xl font-bold">Something went wrong</h2>
      <p className="mt-3 text-sm text-[var(--muted)]">{error.message || "Unknown client error"}</p>
      <button
        onClick={reset}
        className="mt-5 rounded-xl bg-emeraldGlow-500 px-4 py-2 text-sm font-semibold text-white"
      >
        Try again
      </button>
    </div>
  );
}
