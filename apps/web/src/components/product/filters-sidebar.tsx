"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { REQUIRED_CATEGORIES } from "@/lib/constants/categories";

function updateSearchParam(
  searchParams: URLSearchParams,
  key: string,
  value: string | number | null
) {
  if (value === null || value === "") {
    searchParams.delete(key);
  } else {
    searchParams.set(key, String(value));
  }
}

export function FiltersSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [minPrice, setMinPrice] = useState(searchParams.get("priceMin") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("priceMax") ?? "");

  const flatCategories = useMemo(
    () =>
      REQUIRED_CATEGORIES.flatMap((category) => [
        category.name,
        ...(category.children?.map((child) => child.name) ?? [])
      ]),
    []
  );

  const onApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    updateSearchParam(params, "priceMin", minPrice || null);
    updateSearchParam(params, "priceMax", maxPrice || null);
    router.push(`${pathname}?${params.toString()}`);
  };

  const setSingleParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    updateSearchParam(params, key, value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <aside className="glass h-fit space-y-4 rounded-2xl p-4">
      <h3 className="text-sm font-semibold">Filters</h3>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-[var(--muted)]">Price Range</p>
        <div className="flex gap-2">
          <input
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
            placeholder="Min"
            type="number"
            className="w-full rounded-lg border bg-transparent px-2 py-1 text-sm"
          />
          <input
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            placeholder="Max"
            type="number"
            className="w-full rounded-lg border bg-transparent px-2 py-1 text-sm"
          />
        </div>
        <button
          onClick={onApply}
          className="w-full rounded-lg bg-emeraldGlow-500 px-2 py-1 text-xs font-semibold text-white"
        >
          Apply Price
        </button>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-[var(--muted)]">Category</p>
        <div className="max-h-44 space-y-1 overflow-auto text-sm">
          {flatCategories.map((category) => (
            <button
              key={category}
              className="block w-full rounded-lg px-2 py-1 text-left hover:bg-emeraldGlow-50 dark:hover:bg-ink-700"
              onClick={() => setSingleParam("category", category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-[var(--muted)]">Rating</p>
        <div className="space-y-1">
          {[4.5, 4, 3.5].map((value) => (
            <button
              key={value}
              className="block w-full rounded-lg px-2 py-1 text-left text-sm hover:bg-emeraldGlow-50 dark:hover:bg-ink-700"
              onClick={() => setSingleParam("rating", String(value))}
            >
              {value}+ Stars
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-[var(--muted)]">Availability</p>
        <button
          className="block w-full rounded-lg px-2 py-1 text-left text-sm hover:bg-emeraldGlow-50 dark:hover:bg-ink-700"
          onClick={() => setSingleParam("availability", "in_stock")}
        >
          In Stock
        </button>
        <button
          className="block w-full rounded-lg px-2 py-1 text-left text-sm hover:bg-emeraldGlow-50 dark:hover:bg-ink-700"
          onClick={() => setSingleParam("availability", null)}
        >
          All
        </button>
      </div>
    </aside>
  );
}
