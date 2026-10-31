import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@workspace/api-client";
export const sessionKey = ["session"] as const;
export function useSession() {
  return useQuery({
    queryKey: sessionKey,
    queryFn: ({ signal }) => authApi.session(signal),
    staleTime: 0,
    refetchInterval: 30_000,
    retry: false,
  });
}
export function useLogin() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: async (session) => {
      await client.cancelQueries();
      client.removeQueries({
        predicate: (query) => query.queryKey[0] !== "session",
      });
      client.setQueryData(sessionKey, session);
    },
  });
}
export function useLogout() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: async () => {
      await client.cancelQueries();
      client.removeQueries({
        predicate: (query) => query.queryKey[0] !== "session",
      });
      client.setQueryData(sessionKey, null);
    },
  });
}
