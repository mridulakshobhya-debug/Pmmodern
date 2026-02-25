import type { CartResponse } from "@pmmodern/shared-types";
import { apiFetch } from "./http";

const guestHeaders = {
  "x-cart-token": "guest-web-session"
};

export async function fetchCart(token?: string) {
  return apiFetch<CartResponse>("/api/cart", {
    token,
    headers: token ? undefined : guestHeaders
  });
}

export async function addToCart(payload: { productId: string; quantity: number }, token?: string) {
  return apiFetch<CartResponse>("/api/cart", {
    method: "POST",
    token,
    headers: token ? undefined : guestHeaders,
    body: payload
  });
}

export async function updateCartItem(
  itemId: string,
  payload: { quantity: number },
  token?: string
) {
  return apiFetch<CartResponse>(`/api/cart/${itemId}`, {
    method: "PUT",
    token,
    headers: token ? undefined : guestHeaders,
    body: payload
  });
}

export async function removeCartItem(itemId: string, token?: string) {
  return apiFetch<CartResponse>(`/api/cart/${itemId}`, {
    method: "DELETE",
    token,
    headers: token ? undefined : guestHeaders
  });
}
