import type { Request, Response } from "express";
import { CartService } from "../services/cart/cart.service.js";

const service = new CartService();

function getCartKey(req: Request) {
  if (req.user?.id) {
    return `user:${req.user.id}`;
  }
  const guestToken = req.headers["x-cart-token"];
  if (typeof guestToken === "string" && guestToken.length > 0) {
    return `guest:${guestToken}`;
  }
  return "guest:default";
}

export function getCart(req: Request, res: Response) {
  return res.json(service.getCart(getCartKey(req)));
}

export function addCartItem(req: Request, res: Response) {
  const cart = service.addToCart(getCartKey(req), req.body);
  return res.status(201).json(cart);
}

export function updateCartItem(req: Request, res: Response) {
  const cart = service.updateCartItem(getCartKey(req), req.params.id, req.body);
  return res.json(cart);
}

export function deleteCartItem(req: Request, res: Response) {
  const cart = service.removeCartItem(getCartKey(req), req.params.id);
  return res.json(cart);
}
