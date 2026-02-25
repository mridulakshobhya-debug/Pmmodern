"use client";

import { BookmarkPlus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SORT_OPTIONS = [
  { label: "Popularity", value: "popularity" },
  { label: "Price Low to High", value: "price_asc" },
  { label: "Price High to Low", value: "price_desc" },
  { label: "Best Rated", value: "best_rated" }
];

const SAVED_SEARCHES_KEY = "pmmodern_saved_searches";

export function SortAndSave() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selected = searchParams.get("sort") ?? "popularity";

  const setSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  const saveSearch = () => {
    if (typeof window === "undefined") return;
    const current = JSON.parse(localStorage.getItem(SAVED_SEARCHES_KEY) ?? "[]") as string[];
    const next = [window.location.href, ...current.filter((entry) => entry !== window.location.href)].slice(0, 10);
    localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(next));
  };

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <select
        value={selected}
        onChange={(event) => setSort(event.target.value)}
        className="glass rounded-xl px-3 py-2 text-sm"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button
        onClick={saveSearch}
        className="glass inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium"
      >
        <BookmarkPlus className="h-4 w-4" />
        Save Search
      </button>
    </div>
  );
}
