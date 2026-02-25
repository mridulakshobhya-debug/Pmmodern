import type { Request, Response } from "express";
import { OrderService } from "../services/orders/order.service.js";

const service = new OrderService();

export function getOrders(req: Request, res: Response) {
  const requestedUserId = req.params.userId;
  if (!req.user || req.user.id !== requestedUserId) {
    return res.status(403).json({ message: "Forbidden" });
  }
  return res.json(service.getUserOrders(requestedUserId));
}
