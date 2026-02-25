import type { CartItem, CartResponse } from "@pmmodern/shared-types";
import { carts } from "../db/mock-data.js";
import { ProductRepository } from "./product.repository.js";

const productRepository = new ProductRepository();

function calculateCart(items: CartItem[]): CartResponse {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const totalDiscount = items.reduce(
    (sum, item) => sum + (item.unitPrice * item.discountPercent * item.quantity) / 100,
    0
  );

  return {
    items,
    subtotal: Number(subtotal.toFixed(2)),
    totalDiscount: Number(totalDiscount.toFixed(2)),
    grandTotal: Number((subtotal - totalDiscount).toFixed(2))
  };
}

export class CartRepository {
  getCart(key: string): CartResponse {
    const items = carts.get(key) ?? [];
    return calculateCart(items);
  }

  addItem(key: string, productId: string, quantity: number): CartResponse {
    const product = productRepository.findByIdOrSlug(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    const current = carts.get(key) ?? [];
    const existing = current.find((item) => item.productId === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      current.push({
        id: `cart-item-${Date.now()}`,
        productId: product.id,
        title: product.title,
        slug: product.slug,
        image: product.images[0] ?? "",
        unitPrice: product.price,
        discountPercent: product.discountPercent,
        quantity
      });
    }

    carts.set(key, current);
    return calculateCart(current);
  }

  updateItem(key: string, itemId: string, quantity: number): CartResponse {
    const current = carts.get(key) ?? [];
    const target = current.find((item) => item.id === itemId);
    if (!target) {
      throw new Error("Cart item not found");
    }
    target.quantity = quantity;
    carts.set(key, current.filter((item) => item.quantity > 0));
    return calculateCart(carts.get(key) ?? []);
  }

  deleteItem(key: string, itemId: string): CartResponse {
    const current = carts.get(key) ?? [];
    const next = current.filter((item) => item.id !== itemId);
    carts.set(key, next);
    return calculateCart(next);
  }
}
