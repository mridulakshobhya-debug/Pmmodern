import type { Product } from "@pmmodern/shared-types";
import { products } from "../db/mock-data.js";

export interface ProductFilters {
  q?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  availability?: "in_stock" | "all";
  sort?: "popularity" | "price_asc" | "price_desc" | "best_rated";
}

function normalizedPrice(product: Product): number {
  return product.price * (1 - product.discountPercent / 100);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export class ProductRepository {
  list(filters: ProductFilters): Product[] {
    const {
      q,
      category,
      priceMin,
      priceMax,
      rating,
      availability = "all",
      sort = "popularity"
    } = filters;

    let result = [...products];

    if (q) {
      const keyword = q.toLowerCase();
      result = result.filter((product) => {
        const haystack = [
          product.title,
          product.description,
          product.category,
          product.subcategory,
          ...product.tags
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(keyword);
      });
    }

    if (category) {
      const normalized = category.toLowerCase();
      result = result.filter(
        (product) =>
          product.category.toLowerCase() === normalized ||
          product.subcategory.toLowerCase() === normalized ||
          slugify(product.category) === normalized ||
          slugify(product.subcategory) === normalized
      );
    }

    if (typeof priceMin === "number") {
      result = result.filter((product) => normalizedPrice(product) >= priceMin);
    }

    if (typeof priceMax === "number") {
      result = result.filter((product) => normalizedPrice(product) <= priceMax);
    }

    if (typeof rating === "number") {
      result = result.filter((product) => product.rating >= rating);
    }

    if (availability === "in_stock") {
      result = result.filter((product) => product.inStock);
    }

    switch (sort) {
      case "price_asc":
        result.sort((a, b) => normalizedPrice(a) - normalizedPrice(b));
        break;
      case "price_desc":
        result.sort((a, b) => normalizedPrice(b) - normalizedPrice(a));
        break;
      case "best_rated":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "popularity":
      default:
        result.sort((a, b) => b.popularity - a.popularity);
        break;
    }

    return result;
  }

  findByIdOrSlug(idOrSlug: string): Product | undefined {
    return products.find((product) => product.id === idOrSlug || product.slug === idOrSlug);
  }

  relatedProducts(product: Product, limit = 6): Product[] {
    return products
      .filter((item) => item.id !== product.id && item.category === product.category)
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, limit);
  }
}
