// src/Auth/PrivateRoute/PrivateRoute.tsx
import * as React from "react";
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthProvider/AuthProvider";
import { CircularProgress, Box } from "@mui/material";

type Props = { children: React.ReactElement };

export const PrivateRoute: React.FC<Props> = ({ children }) => {
  const auth = useContext(AuthContext);
  const location = useLocation();

  if (!auth) {
    return <Navigate to={`/signin`} replace />;
  }

  const { user, loading } = auth;

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/signin?next=${next}`} replace />;
  }

  return children;
};
