import type { ShopMindResponse } from "@pmmodern/shared-types";
import { apiFetch } from "./http";

export async function chatWithShopMind(payload: { message: string; cartProductIds?: string[] }) {
  return apiFetch<ShopMindResponse>("/api/ai/chat", {
    method: "POST",
    body: payload
  });
}
