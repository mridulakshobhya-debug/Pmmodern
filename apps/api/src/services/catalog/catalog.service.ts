import type { Product, ProductListResponse, SearchResponse } from "@pmmodern/shared-types";
import { categories } from "../../db/mock-data.js";
import { ProductRepository, type ProductFilters } from "../../repositories/product.repository.js";
import { paginate, type PaginationParams } from "../../utils/pagination.js";

const repository = new ProductRepository();

export class CatalogService {
  getCategories() {
    return categories;
  }

  getProducts(filters: ProductFilters, pagination: PaginationParams): ProductListResponse {
    const items = repository.list(filters);
    return paginate(items, pagination);
  }

  getProductDetails(idOrSlug: string): {
    product: Product;
    relatedProducts: Product[];
    seller: Product["seller"];
  } {
    const product = repository.findByIdOrSlug(idOrSlug);
    if (!product) {
      throw new Error("Product not found");
    }

    return {
      product,
      relatedProducts: repository.relatedProducts(product),
      seller: product.seller
    };
  }

  search(query: string): SearchResponse {
    const products = repository.list({
      q: query,
      sort: "popularity"
    });

    const suggestions = [
      ...products.slice(0, 5).map((item) => ({
        type: "product" as const,
        label: item.title,
        slug: item.slug
      })),
      ...categories
        .flatMap((category) => [category, ...(category.children ?? [])])
        .filter((category) => category.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 3)
        .map((category) => ({
          type: "category" as const,
          label: category.name,
          slug: category.slug
        }))
    ];

    return {
      suggestions,
      products: products.slice(0, 20)
    };
  }
}
