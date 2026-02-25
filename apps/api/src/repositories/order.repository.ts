import type { Order } from "@pmmodern/shared-types";
import { orders } from "../db/mock-data.js";

export class OrderRepository {
  getByUserId(userId: string): Order[] {
    return orders
      .filter((order) => order.userId === userId)
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  }
}
