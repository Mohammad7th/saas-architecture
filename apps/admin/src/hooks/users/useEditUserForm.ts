import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  editUserSchema,
  type EditUserInput,
  type User,
} from "@workspace/api-client";
import { useUpdateUser } from "./useUsers";
export function useEditUserForm(user: User) {
  const form = useForm<EditUserInput>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      title: user.title,
      role: user.role,
    },
  });
  const mutation = useUpdateUser(user.id);
  const submit = form.handleSubmit(async (input) => {
    try {
      const saved = await mutation.mutateAsync(input);
      form.reset({
        name: saved.name,
        email: saved.email,
        title: saved.title,
        role: saved.role,
      });
    } catch {
      /* Render mutation error. */
    }
  });
  return { form, submit, mutation };
}
