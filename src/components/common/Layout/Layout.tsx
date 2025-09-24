// src/common/Layout/Layout.tsx
import * as React from "react";
import { Box, Container, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Outlet } from "react-router-dom";
import { AppSidebar, SIDEBAR_WIDTH } from "./Sidebar";
import { Header } from "../Header/Header";

export const Layout: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Left nav */}
      <AppSidebar mobileOpen={open} onClose={() => setOpen(false)} />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { md: `${SIDEBAR_WIDTH}px` }, // <-- reserve space for permanent drawer
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Mobile menu button */}
        <Box sx={{ display: { xs: "block", md: "none" }, p: 1 }}>
          <IconButton
            aria-label="open navigation"
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        {/* App header */}
        <Header />

        {/* Page body container: make it wide or bounded as you prefer */}
        <Container
          maxWidth="lg"
          sx={{ py: 2 /* set maxWidth={false} for full width */ }}
        >
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};
