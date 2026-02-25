import type { Product } from "@pmmodern/shared-types";
import { ProductCard } from "./product-card";
import { GridStagger } from "@/components/animations/grid-stagger";

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return (
      <div className="glass rounded-2xl p-8 text-center text-sm text-[var(--muted)]">
        No products found for the selected filters.
      </div>
    );
  }

  return (
    <>
      <GridStagger selector=".reveal-item" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
