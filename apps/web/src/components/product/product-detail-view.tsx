"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Truck } from "lucide-react";
import type { Product } from "@pmmodern/shared-types";
import { RatingStars } from "@/components/common/rating-stars";
import { ProductGrid } from "./product-grid";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/common/button";
import { ImageWithFallback } from "@/components/common/image-with-fallback";

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
}

const MOCK_REVIEWS = [
  {
    id: "rev-1",
    name: "Anita R.",
    rating: 5,
    comment: "Excellent quality and very fresh delivery."
  },
  {
    id: "rev-2",
    name: "Karthik S.",
    rating: 4,
    comment: "Great packaging and quick shipping."
  }
];

export function ProductDetailView({ product, relatedProducts }: ProductDetailViewProps) {
  const [selectedImage, setSelectedImage] = useState(product.images[0] ?? "/images/placeholder.svg");
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState<"description" | "reviews">("description");
  const wishlist = useWishlistStore((state) => state.has(product.id));
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const addItem = useCartStore((state) => state.addItem);

  const finalPrice = useMemo(
    () => product.price * (1 - product.discountPercent / 100),
    [product.discountPercent, product.price]
  );

  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="glass group overflow-hidden rounded-2xl p-4">
            <ImageWithFallback
              src={selectedImage}
              alt={product.title}
              className="h-[360px] w-full rounded-xl object-cover transition duration-500 group-hover:scale-110"
              width={860}
              height={860}
              priority
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image) => (
              <button
                key={image}
                onClick={() => setSelectedImage(image)}
                className={`overflow-hidden rounded-lg border ${selectedImage === image ? "border-emeraldGlow-500" : "border-transparent"}`}
              >
                <ImageWithFallback
                  src={image}
                  alt={product.title}
                  className="h-16 w-full object-cover"
                  width={120}
                  height={80}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <RatingStars rating={product.rating} />
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-emeraldGlow-700 dark:text-emeraldGlow-300">
              AED {finalPrice.toFixed(2)}
            </span>
            {product.discountPercent > 0 && (
              <>
                <span className="text-sm text-[var(--muted)] line-through">AED {product.price.toFixed(2)}</span>
                <span className="rounded-full bg-softGold-200 px-2 py-0.5 text-xs font-semibold text-ink-900">
                  {product.discountPercent}% OFF
                </span>
              </>
            )}
          </div>

          <div className="glass inline-flex items-center gap-2 rounded-xl px-3 py-2">
            <button
              className="rounded-md border px-2 py-1"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            >
              -
            </button>
            <span className="min-w-8 text-center text-sm font-semibold">{quantity}</span>
            <button className="rounded-md border px-2 py-1" onClick={() => setQuantity((value) => value + 1)}>
              +
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => void addItem(product.id, quantity)} className="flex-1 sm:flex-none">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            <Link
              href="/account/login"
              className="inline-flex items-center justify-center rounded-xl border border-emeraldGlow-500 px-4 py-2 text-sm font-semibold text-emeraldGlow-700 dark:text-emeraldGlow-300"
            >
              Buy Now
            </Link>
            <button
              className={`rounded-xl border px-3 py-2 ${wishlist ? "border-rose-400 bg-rose-50 text-rose-600 dark:bg-rose-950/40" : "border-[var(--border)]"}`}
              onClick={() => toggleWishlist(product.id)}
            >
              <Heart className={`h-4 w-4 ${wishlist ? "fill-current" : ""}`} />
            </button>
          </div>

          <div className="glass space-y-2 rounded-2xl p-4 text-sm">
            <h3 className="font-semibold">Seller Info</h3>
            <p>{product.seller.name}</p>
            <p className="text-[var(--muted)]">
              Seller Rating: {product.seller.rating} ({product.seller.totalReviews} reviews)
            </p>
          </div>

          <div className="glass space-y-2 rounded-2xl p-4 text-sm">
            <h3 className="font-semibold">Delivery & Returns</h3>
            <p className="inline-flex items-center gap-2 text-[var(--muted)]">
              <Truck className="h-4 w-4" />
              Same-day delivery available in selected regions.
            </p>
            <p className="text-[var(--muted)]">7-day return policy for unopened items.</p>
          </div>
        </div>
      </section>

      <section className="glass rounded-2xl p-4">
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setTab("description")}
            className={`rounded-lg px-3 py-1.5 text-sm ${tab === "description" ? "bg-emeraldGlow-500 text-white" : "bg-transparent"}`}
          >
            Description
          </button>
          <button
            onClick={() => setTab("reviews")}
            className={`rounded-lg px-3 py-1.5 text-sm ${tab === "reviews" ? "bg-emeraldGlow-500 text-white" : "bg-transparent"}`}
          >
            Reviews
          </button>
        </div>
        {tab === "description" ? (
          <p className="text-sm text-[var(--muted)]">{product.description}</p>
        ) : (
          <div className="space-y-3">
            {MOCK_REVIEWS.map((review) => (
              <article key={review.id} className="rounded-xl border p-3">
                <p className="text-sm font-semibold">{review.name}</p>
                <RatingStars rating={review.rating} />
                <p className="mt-1 text-sm text-[var(--muted)]">{review.comment}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Related Products</h2>
        <ProductGrid products={relatedProducts} />
      </section>
    </div>
  );
}
