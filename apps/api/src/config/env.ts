import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 4000),
  jwtSecret: process.env.JWT_SECRET ?? "dev-super-secret-change-me",
  jwtExpiry: process.env.JWT_EXPIRY ?? "1h",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000"
} as const;
