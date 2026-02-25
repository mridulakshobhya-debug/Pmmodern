"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useRef, type MouseEventHandler } from "react";
import { ArrowRight } from "lucide-react";
import { useHeroIntro } from "@/components/animations/use-hero-intro";
import { ImageWithFallback } from "@/components/common/image-with-fallback";
import { HERO_BACKDROPS } from "@/lib/constants/product-visuals";

const RiceParticleHero = dynamic(
  () => import("@/components/three/rice-particle-hero").then((mod) => mod.RiceParticleHero),
  { ssr: false }
);

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  useHeroIntro(sectionRef);

  const onMouseMove: MouseEventHandler<HTMLAnchorElement> = (event) => {
    const button = buttonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left - rect.width / 2) * 0.16;
    const offsetY = (event.clientY - rect.top - rect.height / 2) * 0.16;
    button.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  };

  const onMouseLeave = () => {
    if (!buttonRef.current) return;
    buttonRef.current.style.transform = "translate(0px, 0px)";
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden rounded-3xl border border-emeraldGlow-100/50 bg-aurora px-6 py-20 text-white shadow-glass sm:px-10 lg:px-14"
    >
      <RiceParticleHero />
      <div className="absolute inset-0 opacity-30">
        <ImageWithFallback
          src={HERO_BACKDROPS[0]}
          alt="Hero visual backdrop"
          className="h-full w-full object-cover"
          width={1920}
          height={1080}
          priority
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink-900/30 via-transparent to-ink-900/55" />
      <div className="relative z-10 max-w-2xl space-y-5">
        <p className="hero-intro inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.22em] text-softGold-200">
          Premium Grocery Commerce
        </p>
        <h1 className="hero-intro text-4xl font-extrabold leading-tight sm:text-5xl">
          Premium Groceries Delivered Fresh
        </h1>
        <p className="hero-intro text-base text-emeraldGlow-50/90 sm:text-lg">
          Curated essentials, faster doorstep delivery, and a futuristic shopping experience.
        </p>
        <Link
          href="/products?category=groceries"
          ref={buttonRef}
          className="hero-intro magnetic inline-flex items-center gap-2 rounded-xl bg-softGold-400 px-6 py-3 text-sm font-semibold text-ink-900 transition"
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
        >
          Explore Groceries
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="pointer-events-none absolute right-8 top-8 z-10 hidden w-[360px] grid-cols-2 gap-3 lg:grid">
        {HERO_BACKDROPS.map((src, index) => (
          <div
            key={src}
            className={`overflow-hidden rounded-2xl border border-white/15 shadow-2xl ${index === 0 ? "col-span-2 h-36" : "h-28"} animate-float-slow`}
            style={{ animationDelay: `${index * 0.6}s` }}
          >
            <ImageWithFallback
              src={src}
              alt="Premium product visual"
              className="h-full w-full object-cover"
              width={560}
              height={360}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
