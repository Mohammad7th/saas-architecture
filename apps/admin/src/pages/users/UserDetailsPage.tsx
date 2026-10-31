import { Button } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { errorMessage } from "@workspace/api-client";
import { ErrorState, LoadingState, PageHeading } from "@workspace/ui";
import { useUser } from "../../hooks/users/useUsers";
import { EditUserForm } from "../../components/users/EditUserForm";
export function UserDetailsPage() {
  const { id = "" } = useParams();
  const query = useUser(id);
  return (
    <>
      <Button component={Link} to="/users" sx={{ mb: 2 }}>
        ← All members
      </Button>
      {query.isPending ? (
        <LoadingState />
      ) : query.isError ? (
        <ErrorState
          message={errorMessage(query.error)}
          retry={() => void query.refetch()}
        />
      ) : (
        <>
          <PageHeading
            eyebrow="Member details"
            title={query.data.name}
            description={`Member since ${query.data.joinedAt} · ${query.data.id}`}
          />
          <EditUserForm key={query.data.id} user={query.data} />
        </>
      )}
    </>
  );
}
