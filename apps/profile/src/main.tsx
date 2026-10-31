import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ApiError, configureApi } from "@workspace/api-client";
import { AppErrorBoundary, UIProvider } from "@workspace/ui";
import { App } from "./app/App";

configureApi({ baseUrl: import.meta.env.VITE_API_BASE_URL ?? "/api" });
function handleUnauthorized(error: unknown) {
  if (error instanceof ApiError && error.status === 401) {
    void client.cancelQueries().then(() => {
      client.removeQueries({
        predicate: (query) => query.queryKey[0] !== "session",
      });
      client.setQueryData(["session"], null);
    });
  }
}
const client = new QueryClient({
  queryCache: new QueryCache({ onError: handleUnauthorized }),
  mutationCache: new MutationCache({ onError: handleUnauthorized }),
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (count, error) =>
        count < 1 && !(error instanceof ApiError && error.status < 500),
    },
  },
});
async function bootstrap() {
  // Retire the worker installed by the earlier browser-mock version.
  if ("serviceWorker" in navigator) {
    const isLegacy = (url: string) =>
      new URL(url).pathname === "/mockServiceWorker.js";
    for (const registration of await navigator.serviceWorker.getRegistrations()) {
      const worker =
        registration.active ?? registration.waiting ?? registration.installing;
      if (worker && isLegacy(worker.scriptURL)) await registration.unregister();
    }
    if (
      navigator.serviceWorker.controller &&
      isLegacy(navigator.serviceWorker.controller.scriptURL)
    ) {
      location.reload();
      return;
    }
  }
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <UIProvider>
        <AppErrorBoundary>
          <QueryClientProvider client={client}>
            <BrowserRouter basename="/profile">
              <App />
            </BrowserRouter>
          </QueryClientProvider>
        </AppErrorBoundary>
      </UIProvider>
    </StrictMode>,
  );
}
void bootstrap().catch((error) => {
  document.getElementById("root")!.textContent =
    `Unable to start the application: ${error instanceof Error ? error.message : "Unknown error"}. Check the browser console and reload.`;
});
