"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0.84, y: 8 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
    );
  }, [pathname]);

  return <div ref={ref}>{children}</div>;
}
