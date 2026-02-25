"use client";

import { useScrollReveal } from "./use-scroll-reveal";

export function HomeScrollAnimator() {
  useScrollReveal(".reveal-item, .reveal-section");
  return null;
}
