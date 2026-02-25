import Link from "next/link";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { FiltersSidebar } from "@/components/product/filters-sidebar";
import { ProductGrid } from "@/components/product/product-grid";
import { SortAndSave } from "@/components/product/sort-and-save";
import { fetchProducts } from "@/lib/api-client/catalog";

interface ProductsPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

function readParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const page = Number(readParam(searchParams.page) ?? 1);
  const limit = Number(readParam(searchParams.limit) ?? 12);
  const q = readParam(searchParams.q);
  const category = readParam(searchParams.category);
  const priceMin = readParam(searchParams.priceMin);
  const priceMax = readParam(searchParams.priceMax);
  const rating = readParam(searchParams.rating);
  const availability = readParam(searchParams.availability);
  const sort = readParam(searchParams.sort);

  const response = await fetchProducts({
    page,
    limit,
    q,
    category,
    priceMin: priceMin ? Number(priceMin) : undefined,
    priceMax: priceMax ? Number(priceMax) : undefined,
    rating: rating ? Number(rating) : undefined,
    availability: availability === "in_stock" ? "in_stock" : "all",
    sort:
      sort === "price_asc" || sort === "price_desc" || sort === "best_rated" || sort === "popularity"
        ? sort
        : "popularity"
  });

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          ...(category ? [{ label: category }] : [])
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <FiltersSidebar />

        <section>
          <SortAndSave />
          <ProductGrid products={response.items} />
          <div className="mt-6 flex items-center justify-center gap-2">
            {Array.from({ length: response.totalPages }).map((_, index) => {
              const pageNo = index + 1;
              const params = new URLSearchParams();
              for (const [key, value] of Object.entries(searchParams)) {
                if (!value) continue;
                if (Array.isArray(value)) {
                  params.set(key, value[0]);
                } else {
                  params.set(key, value);
                }
              }
              params.set("page", String(pageNo));
              return (
                <Link
                  key={pageNo}
                  href={`/products?${params.toString()}`}
                  className={`rounded-lg border px-3 py-1 text-sm ${pageNo === response.page ? "border-emeraldGlow-500 bg-emeraldGlow-500 text-white" : ""}`}
                >
                  {pageNo}
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
