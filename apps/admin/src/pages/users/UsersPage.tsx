import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { errorMessage } from "@workspace/api-client";
import { ErrorState, LoadingState, PageHeading } from "@workspace/ui";
import { useUsers } from "../../hooks/users/useUsers";
import { UserTable } from "../../components/users/UserTable";
import { useUserFilters } from "../../hooks/users/useUserFilters";
export function UsersPage() {
  const { filters, setSearch, setPage } = useUserFilters();
  const query = useUsers(filters);
  return (
    <>
      <PageHeading
        eyebrow="Administration"
        title="People in your workspace"
        description="Manage member details and access from one place."
      />
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          label="Search by name or email"
          value={filters.search}
          onChange={(event) => setSearch(event.target.value)}
          sx={{ maxWidth: 420 }}
        />
      </Paper>
      {query.isPending ? (
        <LoadingState label="Loading members…" />
      ) : query.isError ? (
        <ErrorState
          message={errorMessage(query.error)}
          retry={() => void query.refetch()}
        />
      ) : (
        <>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2 }}
            aria-live="polite"
          >
            {query.data.total} members{query.isFetching ? " · Updating…" : ""}
          </Typography>
          {query.data.items.length ? (
            <UserTable users={query.data.items} />
          ) : (
            <Paper sx={{ p: 5, textAlign: "center" }}>
              <Typography>No members found.</Typography>
              <Button onClick={() => setSearch("")}>Clear filters</Button>
            </Paper>
          )}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mt: 2 }}
          >
            <Typography variant="body2" color="text.secondary">
              Page {filters.page} of{" "}
              {Math.max(1, Math.ceil(query.data.total / filters.pageSize))}
            </Typography>
            <Stack direction="row" gap={1}>
              <Button
                disabled={filters.page === 1 || query.isPlaceholderData}
                onClick={() => setPage(filters.page - 1)}
              >
                Previous
              </Button>
              <Button
                disabled={
                  filters.page * filters.pageSize >= query.data.total ||
                  query.isPlaceholderData
                }
                onClick={() => setPage(filters.page + 1)}
              >
                Next
              </Button>
            </Stack>
          </Stack>
        </>
      )}
    </>
  );
}
