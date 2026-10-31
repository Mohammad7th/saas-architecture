import { Alert, Button } from "@mui/material";
import { Outlet, useOutletContext } from "react-router-dom";
import type { Session } from "@workspace/api-client";

export function RequireAdmin() {
  const session = useOutletContext<Session>();
  if (session.user.role === "admin") return <Outlet />;
  return (
    <Alert severity="warning">
      This account does not have administrator access.{" "}
      <Button
        href={
          import.meta.env.VITE_PROFILE_URL ??
          (import.meta.env.DEV ? "http://localhost:3001/profile/" : "/profile/")
        }
      >
        Open my profile
      </Button>
    </Alert>
  );
}
