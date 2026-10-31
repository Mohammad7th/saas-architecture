import { lazy } from "react";
import { Button, Typography } from "@mui/material";
import { Link, type RouteObject } from "react-router-dom";
import { LoginPage } from "../pages/auth/LoginPage";
import { RequireAuth } from "./RequireAuth";
import { AppLayout } from "../components/layout/AppLayout";
const ProfilePage = lazy(() =>
  import("../pages/profile/ProfilePage").then((module) => ({
    default: module.ProfilePage,
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
          { index: true, element: <ProfilePage /> },
          {
            path: "*",
            element: (
              <>
                <Typography variant="h4">Page not found</Typography>
                <Button component={Link} to="/">
                  Back to profile
                </Button>
              </>
            ),
          },
        ],
      },
    ],
  },
];
