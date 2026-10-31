import { z } from "zod";
import { ApiError, request } from "../http";
import { sessionSchema, type LoginInput } from "./auth.schema";
export const authApi = {
  async session(signal?: AbortSignal) {
    try {
      return await request("/auth/me", sessionSchema, { signal });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) return null;
      throw error;
    }
  },
  login: (input: LoginInput) =>
    request("/auth/login", sessionSchema, {
      method: "POST",
      body: JSON.stringify(input),
    }),
  logout: () => request("/auth/logout", z.undefined(), { method: "POST" }),
};
