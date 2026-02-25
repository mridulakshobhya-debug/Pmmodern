import { CartRepository } from "../../repositories/cart.repository.js";

const repository = new CartRepository();

export class CartService {
  getCart(cartKey: string) {
    return repository.getCart(cartKey);
  }

  addToCart(cartKey: string, payload: { productId: string; quantity: number }) {
    return repository.addItem(cartKey, payload.productId, payload.quantity);
  }

  updateCartItem(cartKey: string, itemId: string, payload: { quantity: number }) {
    return repository.updateItem(cartKey, itemId, payload.quantity);
  }

  removeCartItem(cartKey: string, itemId: string) {
    return repository.deleteItem(cartKey, itemId);
  }
}
