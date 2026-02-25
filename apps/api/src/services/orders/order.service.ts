import { OrderRepository } from "../../repositories/order.repository.js";

const repository = new OrderRepository();

export class OrderService {
  getUserOrders(userId: string) {
    return repository.getByUserId(userId);
  }
}
