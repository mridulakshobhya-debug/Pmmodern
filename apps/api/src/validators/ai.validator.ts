import { z } from "zod";

export const aiChatSchema = z.object({
  message: z.string().min(2),
  cartProductIds: z.array(z.string()).optional()
});
