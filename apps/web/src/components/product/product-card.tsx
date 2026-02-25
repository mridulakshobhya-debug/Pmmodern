"use client";

import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import type { Product } from "@pmmodern/shared-types";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCartStore } from "@/store/cart-store";
import { RatingStars } from "@/components/common/rating-stars";
import { ImageWithFallback } from "@/components/common/image-with-fallback";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const inWishlist = useWishlistStore((state) => state.has(product.id));
  const addItem = useCartStore((state) => state.addItem);

  const discountedPrice = product.price * (1 - product.discountPercent / 100);

  return (
    <article className="reveal-item glass group rounded-2xl p-3 transition hover:-translate-y-0.5 hover:shadow-card">
      <div className="relative mb-3 overflow-hidden rounded-xl bg-emeraldGlow-50/70 p-4 dark:bg-ink-700">
        {product.discountPercent > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-softGold-400 px-2 py-0.5 text-[10px] font-bold text-ink-900">
            -{product.discountPercent}%
          </span>
        )}
        <button
          className={`absolute right-2 top-2 rounded-full p-1.5 ${inWishlist ? "bg-rose-100 text-rose-600 dark:bg-rose-950/60" : "glass text-[var(--muted)]"}`}
          onClick={() => toggleWishlist(product.id)}
          aria-label="Toggle wishlist"
        >
          <Heart className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`} />
        </button>
        <Link href={`/products/${product.slug}`} className="block">
          <ImageWithFallback
            src={product.images[0] ?? "/images/placeholder.svg"}
            alt={product.title}
            className="mx-auto h-44 w-full rounded-lg object-cover transition duration-300 group-hover:scale-[1.02]"
            width={500}
            height={300}
          />
        </Link>
      </div>
      <Link href={`/products/${product.slug}`}>
        <h3 className="line-clamp-2 text-sm font-semibold">{product.title}</h3>
      </Link>
      <p className="mt-1 text-xs text-[var(--muted)]">{product.subcategory}</p>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-sm font-semibold">AED {discountedPrice.toFixed(2)}</span>
        {product.discountPercent > 0 && (
          <span className="text-xs text-[var(--muted)] line-through">AED {product.price.toFixed(2)}</span>
        )}
      </div>
      <div className="mt-2">
        <RatingStars rating={product.rating} />
      </div>
      <button
        onClick={() => void addItem(product.id, 1)}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emeraldGlow-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emeraldGlow-700"
      >
        <ShoppingCart className="h-4 w-4" />
        Quick Add to Cart
      </button>
    </article>
  );
}
