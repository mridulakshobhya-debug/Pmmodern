import { Router } from "express";
import { getOrders } from "../controllers/orders.controller.js";
import { requireAuth } from "../middleware/auth.js";

export const ordersRouter = Router();

ordersRouter.get("/:userId", requireAuth, getOrders);
