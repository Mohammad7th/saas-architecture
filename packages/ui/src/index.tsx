import { Component, type ErrorInfo, type ReactNode } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Stack,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
const theme = createTheme({
  palette: {
    primary: { main: "#315c4d" },
    background: { default: "#f5f6f3", paper: "#ffffff" },
    text: { primary: "#192d27", secondary: "#64736d" },
  },
  typography: {
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h4: { fontWeight: 700, letterSpacing: "-1px" },
    h5: { fontWeight: 650 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: { root: { border: "1px solid #e1e7e2" } },
    },
    MuiTextField: { defaultProps: { size: "small", fullWidth: true } },
  },
});
export function UIProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
export function LoadingState({
  label = "Loading your workspace…",
}: {
  label?: string;
}) {
  return (
    <Stack alignItems="center" spacing={2} sx={{ py: 8 }} role="status">
      <CircularProgress size={28} />
      <Typography color="text.secondary">{label}</Typography>
    </Stack>
  );
}
export function ErrorState({
  message,
  retry,
}: {
  message: string;
  retry?: () => void;
}) {
  return (
    <Alert
      severity="error"
      action={
        retry ? (
          <Button color="inherit" onClick={retry}>
            Retry
          </Button>
        ) : undefined
      }
    >
      {message}
    </Alert>
  );
}
export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      gap={2}
      sx={{ mb: 4 }}
    >
      <Box>
        <Typography variant="overline" color="text.secondary" letterSpacing={2}>
          {eyebrow}
        </Typography>
        <Typography variant="h4" component="h1" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography color="text.secondary">{description}</Typography>
      </Box>
      {action}
    </Stack>
  );
}
export function WorkspaceFrame({
  product,
  identity,
  navigation,
  actions,
  children,
}: {
  product: string;
  identity: string;
  navigation: ReactNode;
  actions: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <Box
        component="header"
        sx={{ bgcolor: "#192d27", color: "#fff", px: { xs: 2, md: 5 }, py: 2 }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
          flexWrap="wrap"
        >
          <Stack direction="row" alignItems="center" gap={2}>
            <Box
              sx={{
                bgcolor: "#bce0c5",
                color: "#192d27",
                width: 34,
                height: 34,
                borderRadius: 1.5,
                display: "grid",
                placeItems: "center",
                fontWeight: 800,
              }}
            >
              W
            </Box>
            <Typography fontWeight={700}>
              Workspace{" "}
              <Box component="span" sx={{ opacity: 0.55, ml: 1 }}>
                / {product}
              </Box>
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap">
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {identity}
            </Typography>
            {actions}
          </Stack>
        </Stack>
      </Box>
      <Box
        component="nav"
        aria-label="Products"
        sx={{
          bgcolor: "white",
          borderBottom: "1px solid #e1e7e2",
          px: { xs: 2, md: 5 },
          py: 1,
        }}
      >
        {navigation}
      </Box>
      <Container component="main" maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        {children}
      </Container>
      <Container maxWidth="lg" component="footer" sx={{ pb: 3 }}>
        <Typography variant="caption" color="text.secondary">
          Workspace · Frontend architecture challenge
        </Typography>
      </Container>
    </>
  );
}
export class AppErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info);
  }
  render() {
    return this.state.failed ? (
      <Container sx={{ py: 8 }}>
        <ErrorState
          message="The application could not render. Reload to try again."
          retry={() => window.location.reload()}
        />
      </Container>
    ) : (
      this.props.children
    );
  }
}
