import type { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth/auth.service.js";
import { UserRepository } from "../repositories/user.repository.js";

const authService = new AuthService();
const userRepository = new UserRepository();

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : undefined;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = authService.verifyToken(token);
    const user = userRepository.findById(payload.userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = userRepository.toPublicUser(user);
    return next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
