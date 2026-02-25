import type { Request, Response } from "express";
import { CatalogService } from "../services/catalog/catalog.service.js";

const service = new CatalogService();

export function searchProducts(req: Request, res: Response) {
  const q = (req.query.q as string | undefined)?.trim() ?? "";
  if (!q) {
    return res.json({
      suggestions: [],
      products: []
    });
  }

  return res.json(service.search(q));
}
