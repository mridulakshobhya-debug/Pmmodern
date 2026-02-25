import type { Request, Response } from "express";
import { ShopMindService } from "../services/ai/shopmind.service.js";

const service = new ShopMindService();

export function chatWithShopMind(req: Request, res: Response) {
  const response = service.chat(req.body);
  return res.json(response);
}
