import { Router } from "express";
import { getCategories, getProductById, getProducts } from "../controllers/products.controller.js";

export const productsRouter = Router();

productsRouter.get("/", getProducts);
productsRouter.get("/categories", getCategories);
productsRouter.get("/:id", getProductById);
