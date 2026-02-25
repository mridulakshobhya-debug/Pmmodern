import type { User } from "@pmmodern/shared-types";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};
