import type { NextFunction, Request, Response } from "express";
import { parsePagination } from "../utils/pagination.js";

export function withPagination(req: Request, res: Response, next: NextFunction) {
  res.locals.pagination = parsePagination(
    req.query.page as string | undefined,
    req.query.limit as string | undefined
  );
  next();
}
