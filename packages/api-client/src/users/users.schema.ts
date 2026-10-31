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
export const userSchema = editUserSchema.extend({
  id: z.string(),
  joinedAt: z.string(),
});
export const usersPageSchema = z.object({
  items: z.array(userSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
});
export type User = z.infer<typeof userSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type EditUserInput = z.infer<typeof editUserSchema>;
export type UsersPage = z.infer<typeof usersPageSchema>;
export interface UserFilters {
  search: string;
  page: number;
  pageSize: number;
}
