import type { Request, Response } from "express";
import { AuthService } from "../services/auth/auth.service.js";

const service = new AuthService();

export async function register(req: Request, res: Response) {
  try {
    const response = await service.register(req.body);
    return res.status(201).json(response);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Unable to register"
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const response = await service.login(req.body);
    return res.json(response);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Unable to login"
    });
  }
}

export function me(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  return res.json(req.user);
}
