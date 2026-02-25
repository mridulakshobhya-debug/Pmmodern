"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { REQUIRED_CATEGORIES } from "@/lib/constants/categories";

export function CategoriesMegaMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="glass flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium"
        onClick={() => setOpen((value) => !value)}
      >
        Categories
        <ChevronDown className="h-4 w-4" />
      </button>

      {open && (
        <div className="glass absolute left-0 top-full z-50 mt-2 grid w-[760px] grid-cols-3 gap-4 rounded-2xl p-4">
          {REQUIRED_CATEGORIES.map((category) => (
            <div key={category.id} className="space-y-2">
              <Link
                href={`/products?category=${category.slug}`}
                className="text-sm font-semibold text-emeraldGlow-700 dark:text-emeraldGlow-300"
              >
                {category.name}
              </Link>
              <div className="space-y-1">
                {category.children?.map((child) => (
                  <Link
                    key={child.id}
                    href={`/products?category=${child.slug}`}
                    className="block text-xs text-[var(--muted)] transition hover:text-[var(--text)]"
                  >
                    {child.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
