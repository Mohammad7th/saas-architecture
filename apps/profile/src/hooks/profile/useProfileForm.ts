import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  profileSchema,
  type ProfileInput,
  type User,
} from "@workspace/api-client";
import { useUpdateProfile } from "./useProfile";
export function useProfileForm(user: User) {
  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name, email: user.email, title: user.title },
  });
  const mutation = useUpdateProfile();
  const submit = form.handleSubmit(async (input) => {
    try {
      const saved = await mutation.mutateAsync(input);
      form.reset({ name: saved.name, email: saved.email, title: saved.title });
    } catch {
      /* Render mutation error. */
    }
  });
  return { form, submit, mutation };
}
