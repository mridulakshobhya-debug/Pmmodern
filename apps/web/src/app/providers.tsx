"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { hydrateTheme } from "@/store/theme-store";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";

export function AppProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    hydrateTheme();
    void (async () => {
      try {
        // Read actions directly from store to avoid subscribing this provider
        // to auth/cart updates, which can trigger hydration loops in production.
        await useAuthStore.getState().hydrate();
        await useCartStore.getState().hydrateCart();
      } catch {
        // Ignore startup hydration failures to avoid client crash.
      }
    })();
  }, []);

  return children;
}
