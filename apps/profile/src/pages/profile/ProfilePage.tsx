import { Avatar, Box, Chip, Paper, Stack, Typography } from "@mui/material";
import { errorMessage } from "@workspace/api-client";
import { ErrorState, LoadingState, PageHeading } from "@workspace/ui";
import { useProfile } from "../../hooks/profile/useProfile";
import { ProfileForm } from "../../components/profile/ProfileForm";
export function ProfilePage() {
  const query = useProfile();
  if (query.isPending) return <LoadingState />;
  if (query.isError)
    return (
      <ErrorState
        message={errorMessage(query.error)}
        retry={() => void query.refetch()}
      />
    );
  const user = query.data;
  return (
    <>
      <PageHeading
        eyebrow="Your account"
        title="My profile"
        description="Keep your personal information up to date."
      />
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems="flex-start"
        gap={3}
      >
        <Paper
          sx={{ p: 4, width: { xs: "100%", md: 300 }, textAlign: "center" }}
        >
          <Avatar
            sx={{
              width: 72,
              height: 72,
              bgcolor: "#e8efe9",
              color: "primary.main",
              mx: "auto",
              mb: 2,
            }}
          >
            {user.name
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")}
          </Avatar>
          <Typography variant="h6">{user.name}</Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {user.title || "Workspace member"}
          </Typography>
          <Chip label={user.role} size="small" variant="outlined" />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
            Joined {user.joinedAt}
          </Typography>
        </Paper>
        <Box sx={{ flex: 1, width: "100%" }}>
          <ProfileForm key={user.id} user={user} />
        </Box>
      </Stack>
    </>
  );
}
