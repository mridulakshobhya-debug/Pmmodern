"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product } from "@pmmodern/shared-types";
import { ProductGrid } from "@/components/product/product-grid";
import { useWishlistStore } from "@/store/wishlist-store";
import { fetchProducts } from "@/lib/api-client/catalog";

export function WishlistPageClient() {
  const wishlistIds = useWishlistStore((state) => state.productIds);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchProducts({ page: 1, limit: 50, sort: "popularity" })
      .then((response) => setAllProducts(response.items))
      .finally(() => setLoading(false));
  }, []);

  const products = useMemo(
    () => allProducts.filter((product) => wishlistIds.includes(product.id)),
    [allProducts, wishlistIds]
  );

  if (loading) {
    return <p className="text-sm text-[var(--muted)]">Loading wishlist...</p>;
  }

  if (!products.length) {
    return (
      <div className="glass rounded-2xl p-6 text-sm text-[var(--muted)]">
        No products in your wishlist yet.
      </div>
    );
  }

  return <ProductGrid products={products} />;
}
