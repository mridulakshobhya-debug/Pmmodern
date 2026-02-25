import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { productsRouter } from "./routes/products.routes.js";
import { searchRouter } from "./routes/search.routes.js";
import { cartRouter } from "./routes/cart.routes.js";
import { usersRouter } from "./routes/users.routes.js";
import { ordersRouter } from "./routes/orders.routes.js";
import { aiRouter } from "./routes/ai.routes.js";
import { errorHandler } from "./middleware/error-handler.js";

export const app = express();

app.use(
  cors({
    origin: env.corsOrigin
  })
);
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/products", productsRouter);
app.use("/api/search", searchRouter);
app.use("/api/cart", cartRouter);
app.use("/api/users", usersRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/ai", aiRouter);

app.use(errorHandler);
