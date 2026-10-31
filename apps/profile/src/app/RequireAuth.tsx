import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSession } from "../hooks/auth/useAuth";
import { errorMessage } from "@workspace/api-client";
import { ErrorState, LoadingState } from "@workspace/ui";

export function RequireAuth() {
  const session = useSession();
  const location = useLocation();
  if (session.isPending) return <LoadingState />;
  if (session.isError)
    return (
      <ErrorState
        message={errorMessage(session.error)}
        retry={() => void session.refetch()}
      />
    );
  if (!session.data)
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  return <Outlet context={session.data} />;
}
