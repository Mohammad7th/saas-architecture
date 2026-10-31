import { z } from "zod";
import { userSchema } from "../users/users.schema";
export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Enter your password."),
});
export const sessionSchema = z.object({
  user: userSchema,
  expiresAt: z.number(),
});
export type Session = z.infer<typeof sessionSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
