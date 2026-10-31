import {
  Alert,
  Button,
  MenuItem,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import { Controller } from "react-hook-form";
import type { User } from "@workspace/api-client";
import { errorMessage } from "@workspace/api-client";
import { useEditUserForm } from "../../hooks/users/useEditUserForm";
export function EditUserForm({ user }: { user: User }) {
  const { form, submit, mutation } = useEditUserForm(user);
  return (
    <Paper
      component="form"
      onSubmit={submit}
      noValidate
      sx={{ p: { xs: 3, md: 4 }, maxWidth: 680 }}
    >
      <Stack gap={3}>
        <TextField
          label="Full name"
          {...form.register("name")}
          error={!!form.formState.errors.name}
          helperText={form.formState.errors.name?.message}
        />
        <TextField
          label="Email address"
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
        <Controller
          name="role"
          control={form.control}
          render={({ field }) => (
            <TextField select label="Role" {...field}>
              <MenuItem value="member">Member</MenuItem>
              <MenuItem value="admin">Administrator</MenuItem>
            </TextField>
          )}
        />
        {mutation.error && (
          <Alert severity="error">{errorMessage(mutation.error)}</Alert>
        )}
        {mutation.isSuccess && !form.formState.isDirty && (
          <Alert severity="success">Changes saved.</Alert>
        )}
        <Button
          type="submit"
          variant="contained"
          disabled={mutation.isPending || !form.formState.isDirty}
          sx={{ alignSelf: "flex-start" }}
        >
          {mutation.isPending ? "Saving…" : "Save changes"}
        </Button>
      </Stack>
    </Paper>
  );
}
