import { Alert, Button, Stack } from "@mui/material";
import { Outlet, useOutletContext } from "react-router-dom";
import { errorMessage, type Session } from "@workspace/api-client";
import { WorkspaceFrame } from "@workspace/ui";
import { useLogout } from "../../hooks/auth/useAuth";

export function AppLayout() {
  const session = useOutletContext<Session>();
  const logout = useLogout();
  return (
    <WorkspaceFrame
      product="Admin"
      identity={session.user.name}
      navigation={
        <Stack direction="row" gap={1}>
          <Button href="/admin/" variant="contained">
            User management
          </Button>
          <Button
            href={
              import.meta.env.VITE_PROFILE_URL ??
              (import.meta.env.DEV
                ? "http://localhost:3001/profile/"
                : "/profile/")
            }
            variant="text"
          >
            My profile
          </Button>
        </Stack>
      }
      actions={
        <Button
          variant="outlined"
          color="inherit"
          disabled={logout.isPending}
          onClick={() => logout.mutate()}
        >
          Sign out
        </Button>
      }
    >
      {logout.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage(logout.error)}
        </Alert>
      )}
      <Outlet context={session} />
    </WorkspaceFrame>
  );
}
