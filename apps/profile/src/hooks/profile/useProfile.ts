import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "@workspace/api-client";
import { usersApi } from "@workspace/api-client";
import { sessionKey } from "../auth/useAuth";
export const profileKey = ["users", "me"] as const;
export function useProfile() {
  return useQuery({
    queryKey: profileKey,
    queryFn: ({ signal }) => usersApi.me(signal),
  });
}
function useRefreshProfile() {
  const client = useQueryClient();
  return async (user: User) => {
    client.setQueryData(profileKey, user);
    await Promise.all([
      client.invalidateQueries({ queryKey: profileKey }),
      client.invalidateQueries({ queryKey: sessionKey }),
    ]);
  };
}
export function useUpdateProfile() {
  return useMutation({
    mutationFn: usersApi.updateMe,
    onSuccess: useRefreshProfile(),
  });
}
