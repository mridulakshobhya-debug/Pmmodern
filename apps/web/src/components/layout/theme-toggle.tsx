"use client";

import { Moon, SunMedium } from "lucide-react";
import { useThemeStore } from "@/store/theme-store";

export function ThemeToggle() {
  const mode = useThemeStore((state) => state.mode);
  const toggle = useThemeStore((state) => state.toggle);

  return (
    <button
      onClick={toggle}
      className="glass rounded-full p-2 text-[var(--muted)] hover:text-[var(--text)]"
      aria-label="Toggle dark mode"
    >
      {mode === "dark" ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
