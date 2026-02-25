"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import type { SearchSuggestion } from "@pmmodern/shared-types";
import { fetchSearch } from "@/lib/api-client/catalog";

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      void fetchSearch(query)
        .then((data) => setSuggestions(data.suggestions))
        .catch(() => setSuggestions([]));
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative w-full max-w-xl">
      <div className="glass flex items-center gap-2 rounded-xl px-3 py-2">
        <Search className="h-4 w-4 text-[var(--muted)]" />
        <input
          value={query}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 100)}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search rice, pulses, flour, spices..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
        />
      </div>
      {open && suggestions.length > 0 && (
        <div className="glass absolute left-0 right-0 top-full z-50 mt-2 rounded-xl p-2">
          {suggestions.map((item) => (
            <Link
              key={`${item.type}-${item.slug}-${item.label}`}
              href={
                item.type === "product"
                  ? `/products/${item.slug}`
                  : `/products?category=${item.slug}`
              }
              className="block rounded-lg px-3 py-2 text-sm text-[var(--text)] hover:bg-emeraldGlow-100/60 dark:hover:bg-ink-700"
            >
              <span className="mr-2 text-xs uppercase text-[var(--muted)]">{item.type}</span>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
