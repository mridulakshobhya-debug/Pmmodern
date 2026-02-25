import type { Order } from "@pmmodern/shared-types";
import { apiFetch } from "./http";

export async function fetchOrders(userId: string, token: string) {
  return apiFetch<Order[]>(`/api/orders/${userId}`, { token });
}
