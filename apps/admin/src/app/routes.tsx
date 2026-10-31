import { lazy } from "react";
import { Button, Typography } from "@mui/material";
import { Link, Navigate, type RouteObject } from "react-router-dom";
import { LoginPage } from "../pages/auth/LoginPage";
import { RequireAuth } from "./RequireAuth";
import { AppLayout } from "../components/layout/AppLayout";
import { RequireAdmin } from "./RequireAdmin";
const UsersPage = lazy(() =>
  import("../pages/users/UsersPage").then((module) => ({
    default: module.UsersPage,
  })),
);
const UserDetailsPage = lazy(() =>
  import("../pages/users/UserDetailsPage").then((module) => ({
    default: module.UserDetailsPage,
  })),
);

export const routes: RouteObject[] = [
  { path: "login", element: <LoginPage /> },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            element: <RequireAdmin />,
            children: [
              { index: true, element: <Navigate to="/users" replace /> },
              { path: "users", element: <UsersPage /> },
              { path: "users/:id", element: <UserDetailsPage /> },
              {
                path: "*",
                element: (
                  <>
                    <Typography variant="h4">Page not found</Typography>
                    <Button component={Link} to="/users">
                      Back to users
                    </Button>
                  </>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
];
