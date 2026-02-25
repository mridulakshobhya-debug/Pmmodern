"use client";

import { create } from "zustand";

interface ThemeState {
  mode: "light" | "dark";
  setMode: (mode: "light" | "dark") => void;
  toggle: () => void;
}

const THEME_KEY = "pmmodern_theme";

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: "light",
  setMode: (mode) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(THEME_KEY, mode);
      document.documentElement.classList.toggle("dark", mode === "dark");
    }
    set({ mode });
  },
  toggle: () => {
    const next = get().mode === "dark" ? "light" : "dark";
    get().setMode(next);
  }
}));

export function hydrateTheme() {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem(THEME_KEY) as "light" | "dark" | null;
  const mode =
    stored ??
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  document.documentElement.classList.toggle("dark", mode === "dark");
  useThemeStore.setState({ mode });
}
