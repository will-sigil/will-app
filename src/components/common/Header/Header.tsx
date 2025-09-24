import { AppBar, Container, Toolbar, Typography } from "@mui/material";
import { BeachAccess } from "@mui/icons-material";

export const Header = () => {
  return (
    <AppBar position="static">
      <Container>
        <Toolbar>
          <BeachAccess sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Will App
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
