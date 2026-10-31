import {
  Alert,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { User } from "@workspace/api-client";
import { errorMessage } from "@workspace/api-client";
import { useProfileForm } from "../../hooks/profile/useProfileForm";
export function ProfileForm({ user }: { user: User }) {
  const { form, submit, mutation } = useProfileForm(user);
  return (
    <Paper
      component="form"
      onSubmit={submit}
      noValidate
      sx={{ p: { xs: 3, md: 4 } }}
    >
      <Stack gap={3}>
        <Typography variant="h6">Personal information</Typography>
        <TextField
          label="Full name"
          autoComplete="name"
          {...form.register("name")}
          error={!!form.formState.errors.name}
          helperText={form.formState.errors.name?.message}
        />
        <TextField
          label="Email address"
          autoComplete="email"
          {...form.register("email")}
          error={!!form.formState.errors.email}
          helperText={form.formState.errors.email?.message}
        />
        <TextField
          label="Job title"
          {...form.register("title")}
          error={!!form.formState.errors.title}
          helperText={form.formState.errors.title?.message}
        />
        {mutation.error && (
          <Alert severity="error">{errorMessage(mutation.error)}</Alert>
        )}
        {mutation.isSuccess && !form.formState.isDirty && (
          <Alert severity="success">Profile updated.</Alert>
        )}
        <Button
          type="submit"
          variant="contained"
          disabled={mutation.isPending || !form.formState.isDirty}
          sx={{ alignSelf: "flex-start" }}
        >
          {mutation.isPending ? "Saving…" : "Save profile"}
        </Button>
      </Stack>
    </Paper>
  );
}
