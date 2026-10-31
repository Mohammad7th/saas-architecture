import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useLogin } from "./useAuth";
import { loginSchema, type LoginInput } from "@workspace/api-client";
export function useLoginForm() {
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const login = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const requested: unknown = (location.state as { from?: unknown } | null)
    ?.from;
  const destination =
    typeof requested === "string" &&
    requested.startsWith("/") &&
    !requested.startsWith("//") &&
    requested !== "/login"
      ? requested
      : "/";
  const submit = form.handleSubmit(async (values) => {
    try {
      await login.mutateAsync(values);
      void navigate(destination, { replace: true });
    } catch {
      /* Mutation state owns the error. */
    }
  });
  return {
    form,
    submit,
    destination,
    error: login.error,
    isPending: login.isPending,
  };
}
