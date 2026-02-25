import type { Request, Response } from "express";
import { CatalogService } from "../services/catalog/catalog.service.js";
import { parsePagination } from "../utils/pagination.js";

const service = new CatalogService();

export function getCategories(_req: Request, res: Response) {
  return res.json(service.getCategories());
}

export function getProducts(req: Request, res: Response) {
  const pagination = parsePagination(
    req.query.page as string | undefined,
    req.query.limit as string | undefined
  );

  const data = service.getProducts(
    {
      q: req.query.q as string | undefined,
      category: req.query.category as string | undefined,
      priceMin: req.query.priceMin ? Number(req.query.priceMin) : undefined,
      priceMax: req.query.priceMax ? Number(req.query.priceMax) : undefined,
      rating: req.query.rating ? Number(req.query.rating) : undefined,
      availability: req.query.availability as "in_stock" | "all" | undefined,
      sort: req.query.sort as "popularity" | "price_asc" | "price_desc" | "best_rated" | undefined
    },
    pagination
  );

  return res.json(data);
}

export function getProductById(req: Request, res: Response) {
  const details = service.getProductDetails(req.params.id);
  return res.json(details);
}
