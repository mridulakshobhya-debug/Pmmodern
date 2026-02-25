import type { CategoryNode, ProductListResponse, SearchResponse } from "@pmmodern/shared-types";
import { apiFetch } from "./http";

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  q?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  availability?: "in_stock" | "all";
  sort?: "popularity" | "price_asc" | "price_desc" | "best_rated";
}

function toQueryString(params: ProductQueryParams) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    query.set(key, String(value));
  }
  const serialized = query.toString();
  return serialized ? `?${serialized}` : "";
}

export async function fetchCategories() {
  return apiFetch<CategoryNode[]>("/api/products/categories", {
    cache: "force-cache",
    next: { revalidate: 3600 }
  });
}

export async function fetchProducts(params: ProductQueryParams) {
  return apiFetch<ProductListResponse>(`/api/products${toQueryString(params)}`, {
    cache: "no-store"
  });
}

export async function fetchProductDetails(idOrSlug: string) {
  return apiFetch<{
    product: ProductListResponse["items"][number];
    relatedProducts: ProductListResponse["items"];
    seller: ProductListResponse["items"][number]["seller"];
  }>(`/api/products/${idOrSlug}`, { cache: "no-store" });
}

export async function fetchSearch(query: string) {
  return apiFetch<SearchResponse>(`/api/search?q=${encodeURIComponent(query)}`, { cache: "no-store" });
}
