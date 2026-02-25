import { Router } from "express";
import { chatWithShopMind } from "../controllers/ai.controller.js";
import { rateLimit } from "../middleware/rate-limit.js";
import { validateBody } from "../middleware/validate.js";
import { aiChatSchema } from "../validators/ai.validator.js";

export const aiRouter = Router();

aiRouter.post("/chat", rateLimit(20, 60_000), validateBody(aiChatSchema), chatWithShopMind);
