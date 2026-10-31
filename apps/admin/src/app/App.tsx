import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import { LoadingState } from "@workspace/ui";
import { routes } from "./routes";

export function App() {
  const content = useRoutes(routes);
  return <Suspense fallback={<LoadingState />}>{content}</Suspense>;
}
