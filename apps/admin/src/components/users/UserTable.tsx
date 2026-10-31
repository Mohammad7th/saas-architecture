import {
  Avatar,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import type { User } from "@workspace/api-client";
export function UserTable({ users }: { users: User[] }) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="Users">
        <TableHead>
          <TableRow>
            <TableCell>Member</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Joined</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} hover>
              <TableCell>
                <Stack direction="row" alignItems="center" gap={2}>
                  <Avatar
                    sx={{ bgcolor: "#e8efe9", color: "#315c4d", fontSize: 15 }}
                  >
                    {user.name
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")}
                  </Avatar>
                  <Box>
                    <Typography fontWeight={600}>{user.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                </Stack>
              </TableCell>
              <TableCell>
                <Chip
                  size="small"
                  label={user.role}
                  variant="outlined"
                  color={user.role === "admin" ? "primary" : "default"}
                />
              </TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>
                {user.joinedAt}
              </TableCell>
              <TableCell align="right">
                <Button
                  component={Link}
                  to={`/users/${user.id}`}
                  aria-label={`View ${user.name}`}
                >
                  View details →
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
