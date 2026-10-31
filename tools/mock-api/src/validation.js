import { z } from "zod";
export const roleSchema = z.enum(["admin", "member"]);
export const profileSchema = z
  .object({
    name: z.string().trim().min(2, "Use at least 2 characters.").max(80),
    email: z
      .email("Enter a valid email address.")
      .transform((value) => value.toLowerCase()),
    title: z.string().trim().max(100),
  })
  .strict();
export const editUserSchema = profileSchema.extend({ role: roleSchema });
export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Enter your password."),
});
