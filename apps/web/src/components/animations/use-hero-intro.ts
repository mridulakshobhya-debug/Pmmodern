"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";

export function useHeroIntro(containerRef: RefObject<HTMLElement>) {
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-intro",
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, stagger: 0.14, duration: 0.9, ease: "power3.out" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [containerRef]);
}
