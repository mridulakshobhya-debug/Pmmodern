import type { ShopMindIntent, ShopMindResponse } from "@pmmodern/shared-types";
import { ProductRepository } from "../../repositories/product.repository.js";

const productRepository = new ProductRepository();

interface ShopMindRequest {
  message: string;
  cartProductIds?: string[];
}

function detectIntent(message: string): ShopMindIntent {
  const normalized = message.toLowerCase();
  if (normalized.includes("compare")) {
    return "compare_products";
  }
  if (normalized.includes("filter")) {
    return "suggest_filters";
  }
  if (normalized.includes("add") && normalized.includes("cart")) {
    return "build_cart";
  }
  if (normalized.includes("recommend") || normalized.includes("suggest")) {
    return "recommend_products";
  }
  return "answer_question";
}

export class ShopMindService {
  chat(request: ShopMindRequest): ShopMindResponse {
    const intent = detectIntent(request.message);
    const candidates = productRepository
      .list({
        q: request.message,
        availability: "in_stock",
        sort: "popularity"
      })
      .slice(0, 4);

    const suggestedProducts = candidates.map((product) => ({
      id: product.id,
      title: product.title,
      price: Number((product.price * (1 - product.discountPercent / 100)).toFixed(2)),
      slug: product.slug,
      reason: this.reasonForProduct(intent, product.tags)
    }));

    const comparisonTable =
      intent === "compare_products"
        ? candidates.slice(0, 3).map((product) => ({
            productId: product.id,
            productTitle: product.title,
            values: {
              price: Number((product.price * (1 - product.discountPercent / 100)).toFixed(2)),
              rating: product.rating,
              inStock: product.inStock ? "Yes" : "No"
            }
          }))
        : [];

    const cartActions =
      intent === "build_cart"
        ? suggestedProducts.slice(0, 2).map((product) => ({
            action: "add" as const,
            productId: product.id,
            quantity: 1
          }))
        : [];

    const suggestedFilters = this.suggestFilters(request.message);

    return {
      intent,
      replyText: this.buildReply(intent, suggestedProducts.length),
      suggestedProducts,
      suggestedFilters,
      cartActions,
      comparisonTable
    };
  }

  private buildReply(intent: ShopMindIntent, count: number) {
    switch (intent) {
      case "compare_products":
        return `I compared top options for you and found ${count} strong matches.`;
      case "build_cart":
        return `I prepared a smart starter cart with ${count} relevant items. Review and confirm before adding.`;
      case "suggest_filters":
        return "Based on your request, these filters should narrow results quickly.";
      case "recommend_products":
        return `Here are ${count} products aligned with your preferences.`;
      case "answer_question":
      default:
        return "I reviewed the catalog and found products that best answer your question.";
    }
  }

  private reasonForProduct(intent: ShopMindIntent, tags: string[]) {
    switch (intent) {
      case "compare_products":
        return "Strong balance of price, ratings, and availability.";
      case "build_cart":
        return "Fits your request and complements other grocery essentials.";
      case "suggest_filters":
        return "Matches your requested attributes and current filter intent.";
      case "recommend_products":
        return `Popular among shoppers looking for ${tags[0] ?? "similar products"}.`;
      case "answer_question":
      default:
        return "Relevant match based on product description and customer ratings.";
    }
  }

  private suggestFilters(message: string): Record<string, string | number | boolean> {
    const normalized = message.toLowerCase();
    if (normalized.includes("budget")) {
      return { sort: "price_asc", priceMax: 40 };
    }
    if (normalized.includes("premium")) {
      return { sort: "best_rated", rating: 4.5 };
    }
    if (normalized.includes("in stock")) {
      return { availability: true };
    }
    return { sort: "popularity" };
  }
}
