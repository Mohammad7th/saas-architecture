import { request } from "../http";
import {
  userSchema,
  usersPageSchema,
  type EditUserInput,
  type ProfileInput,
  type UserFilters,
} from "./users.schema";
export const usersApi = {
  list: (filters: UserFilters, signal?: AbortSignal) =>
    request(
      `/users?${new URLSearchParams({ search: filters.search, page: String(filters.page), pageSize: String(filters.pageSize) })}`,
      usersPageSchema,
      { signal },
    ),
  detail: (id: string, signal?: AbortSignal) =>
    request(`/users/${encodeURIComponent(id)}`, userSchema, { signal }),
  update: (id: string, input: EditUserInput) =>
    request(`/users/${encodeURIComponent(id)}`, userSchema, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  me: (signal?: AbortSignal) => request("/me", userSchema, { signal }),
  updateMe: (input: ProfileInput) =>
    request("/me", userSchema, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
};
