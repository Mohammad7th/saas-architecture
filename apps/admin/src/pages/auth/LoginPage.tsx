import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Navigate } from "react-router-dom";
import { useSession } from "../../hooks/auth/useAuth";
import { errorMessage } from "@workspace/api-client";
import { ErrorState, LoadingState } from "@workspace/ui";
import { useLoginForm } from "../../hooks/auth/useLoginForm";
export function LoginPage() {
  const session = useSession();
  const { form, submit, destination, error, isPending } = useLoginForm();
  if (session.isPending) return <LoadingState />;
  if (session.isError)
    return (
      <ErrorState
        message={errorMessage(session.error)}
        retry={() => void session.refetch()}
      />
    );
  if (session.data) return <Navigate to={destination} replace />;
  return (
    <Container maxWidth="sm" sx={{ py: { xs: 5, md: 10 } }}>
      <Typography variant="overline" letterSpacing={3} color="primary">
        WORKSPACE / ADMIN
      </Typography>
      <Typography variant="h4" component="h1" sx={{ mt: 2, mb: 1 }}>
        Welcome back.
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Sign in to your workspace to continue.
      </Typography>
      <Paper sx={{ p: { xs: 3, sm: 4 } }}>
        <Box component="form" onSubmit={submit} noValidate>
          <Stack gap={3}>
            <TextField
              label="Email address"
              autoComplete="username"
              type="email"
              {...form.register("email")}
              error={!!form.formState.errors.email}
              helperText={form.formState.errors.email?.message}
            />
            <TextField
              label="Password"
              type="password"
              autoComplete="current-password"
              {...form.register("password")}
              error={!!form.formState.errors.password}
              helperText={form.formState.errors.password?.message}
            />
            {error && <Alert severity="error">{errorMessage(error)}</Alert>}
            <Button
              variant="contained"
              type="submit"
              size="large"
              disabled={isPending}
            >
              {isPending ? "Signing in…" : "Sign in"}
            </Button>
          </Stack>
        </Box>
      </Paper>
      {import.meta.env.DEV && (
        <Alert severity="info" sx={{ mt: 3 }}>
          Demo accounts
          <br />
          Admin: admin@example.com
          <br />
          Member: member@example.com
          <br />
          Password for both: demo1234
        </Alert>
      )}
    </Container>
  );
}
