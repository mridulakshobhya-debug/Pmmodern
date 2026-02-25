import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroSection } from "@/components/layout/hero-section";
import { ProductGrid } from "@/components/product/product-grid";
import { ImageWithFallback } from "@/components/common/image-with-fallback";
import { fetchProducts } from "@/lib/api-client/catalog";
import { REQUIRED_CATEGORIES } from "@/lib/constants/categories";
import { CATEGORY_BACKDROPS, PROMO_TILES } from "@/lib/constants/product-visuals";
import { HomeScrollAnimator } from "@/components/animations/home-scroll-animator";

export default async function HomePage() {
  const groceryCategory = REQUIRED_CATEGORIES.find((category) => category.slug === "groceries");
  const groceryChildren = groceryCategory?.children ?? [];

  const popular = await fetchProducts({
    page: 1,
    limit: 8,
    sort: "popularity"
  });
  const topRated = await fetchProducts({
    page: 1,
    limit: 4,
    sort: "best_rated"
  });

  return (
    <div className="space-y-10">
      <HomeScrollAnimator />
      <HeroSection />

      <section className="reveal-section space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Groceries Category</h2>
          <Link href="/products" className="inline-flex items-center gap-1 text-sm font-semibold text-emeraldGlow-700 dark:text-emeraldGlow-300">
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {groceryChildren.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-[var(--border)] p-4 text-center text-sm font-semibold shadow-card"
            >
              <div className="absolute inset-0">
                <ImageWithFallback
                  src={CATEGORY_BACKDROPS[category.slug] ?? PROMO_TILES[0]}
                  alt={category.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  width={500}
                  height={340}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/30 to-black/70" />
              </div>
              <span className="relative z-10 text-white">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="reveal-section">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Premium Picks</h2>
          <Link href="/products?sort=popularity" className="inline-flex items-center gap-1 text-sm font-semibold text-emeraldGlow-700 dark:text-emeraldGlow-300">
            Explore picks
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {PROMO_TILES.map((tile, index) => (
            <article key={tile} className="glass overflow-hidden rounded-2xl">
              <ImageWithFallback
                src={tile}
                alt={`Premium pick ${index + 1}`}
                className="h-52 w-full object-cover"
                width={640}
                height={360}
              />
              <div className="p-4">
                <p className="text-sm font-semibold">Premium Picks {index + 1}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Premium curated catalog selections.
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="reveal-section">
        <h2 className="mb-4 text-2xl font-bold">New Arrivals</h2>
        <ProductGrid products={popular.items} />
      </section>

      <section className="reveal-section">
        <h2 className="mb-4 text-2xl font-bold">Special Offers</h2>
        <ProductGrid products={topRated.items} />
      </section>

      <section className="reveal-section rounded-2xl border border-emeraldGlow-100/30 bg-gradient-to-br from-emeraldGlow-50/50 to-transparent p-8 dark:from-emeraldGlow-950/20">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-2 text-2xl font-bold">Contact Us</h2>
          <p className="mb-6 text-[var(--muted)]">Get in touch with our team for inquiries and support.</p>
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-foreground">PM MODERN GENERAL TRADING FZ-LLC</p>
              <p className="text-sm text-[var(--muted)]">
                FOB50736<br />
                Compass Building, Al Shohada Road<br />
                Al Hamra Industrial Zone-FZ
              </p>
            </div>
            <div className="flex gap-6">
              <Link href="mailto:support@pmmodern.com" className="text-sm font-semibold text-emeraldGlow-700 hover:text-emeraldGlow-600 dark:text-emeraldGlow-300 dark:hover:text-emeraldGlow-200">
                Email Us
              </Link>
              <Link href="/" className="text-sm font-semibold text-emeraldGlow-700 hover:text-emeraldGlow-600 dark:text-emeraldGlow-300 dark:hover:text-emeraldGlow-200">
                Call Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
