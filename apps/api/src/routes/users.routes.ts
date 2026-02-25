import { Router } from "express";
import { login, me, register } from "../controllers/users.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { rateLimit } from "../middleware/rate-limit.js";
import { validateBody } from "../middleware/validate.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";

export const usersRouter = Router();

usersRouter.post("/register", rateLimit(15, 60_000), validateBody(registerSchema), register);
usersRouter.post("/login", rateLimit(15, 60_000), validateBody(loginSchema), login);
usersRouter.get("/me", requireAuth, me);
