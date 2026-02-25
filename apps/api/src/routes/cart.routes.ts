import { Router } from "express";
import { addCartItem, deleteCartItem, getCart, updateCartItem } from "../controllers/cart.controller.js";
import { validateBody } from "../middleware/validate.js";
import { addCartItemSchema, updateCartItemSchema } from "../validators/cart.validator.js";

export const cartRouter = Router();

cartRouter.get("/", getCart);
cartRouter.post("/", validateBody(addCartItemSchema), addCartItem);
cartRouter.put("/:id", validateBody(updateCartItemSchema), updateCartItem);
cartRouter.delete("/:id", deleteCartItem);
