"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";

export function GridStagger({ selector }: { selector: string }) {
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        selector,
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: "power2.out",
          stagger: 0.06
        }
      );
    });

    return () => ctx.revert();
  }, [selector]);

  return null;
}
