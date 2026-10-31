import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { EditUserInput, User, UserFilters } from "@workspace/api-client";
import { usersApi } from "@workspace/api-client";
import { sessionKey } from "../auth/useAuth";
export const userKeys = {
  all: ["users"] as const,
  lists: ["users", "list"] as const,
  list: (filters: UserFilters) => ["users", "list", filters] as const,
  detail: (id: string) => ["users", "detail", id] as const,
};
export function useUsers(filters: UserFilters) {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: ({ signal }) => usersApi.list(filters, signal),
    placeholderData: keepPreviousData,
  });
}
export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: ({ signal }) => usersApi.detail(id, signal),
  });
}
function useRefreshUsers() {
  const client = useQueryClient();
  return async (user: User) => {
    client.setQueryData(userKeys.detail(user.id), user);
    await Promise.all([
      client.invalidateQueries({ queryKey: userKeys.all }),
      client.invalidateQueries({ queryKey: sessionKey }),
    ]);
  };
}
export function useUpdateUser(id: string) {
  return useMutation({
    mutationFn: (input: EditUserInput) => usersApi.update(id, input),
    onSuccess: useRefreshUsers(),
  });
}
