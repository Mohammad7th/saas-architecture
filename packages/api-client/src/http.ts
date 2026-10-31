import type { z } from "zod";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly fields?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
let baseUrl = "/api";
export function configureApi(options: { baseUrl: string }) {
  baseUrl = options.baseUrl.replace(/\/$/, "");
}
export async function request<T>(
  path: string,
  schema: z.ZodType<T>,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });
  const body: unknown =
    response.status === 204 ? undefined : await response.json();
  if (!response.ok) {
    const error = body as { message?: string; fields?: Record<string, string> };
    throw new ApiError(
      response.status,
      error?.message ?? "The request failed.",
      error?.fields,
    );
  }
  return schema.parse(body);
}
export function errorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
}
