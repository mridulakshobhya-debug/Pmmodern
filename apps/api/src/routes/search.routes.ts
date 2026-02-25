import { Router } from "express";
import { searchProducts } from "../controllers/search.controller.js";

export const searchRouter = Router();

searchRouter.get("/", searchProducts);
