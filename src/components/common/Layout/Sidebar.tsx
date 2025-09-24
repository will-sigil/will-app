import * as React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { PeopleOutline, Assignment, Dashboard } from "@mui/icons-material";
import { NavLink } from "react-router-dom";

export const SIDEBAR_WIDTH = 240;

type Props = { mobileOpen: boolean; onClose: () => void };

export const AppSidebar: React.FC<Props> = ({ mobileOpen, onClose }) => {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));

  const content = (
    <Box role="navigation" sx={{ width: SIDEBAR_WIDTH }}>
      <Toolbar />
      <List>
        <ListItemButton
          component={NavLink}
          to="/"
          data-tour="nav-dashboard"
          sx={{ "&.active": { bgcolor: "action.selected" } }}
          onClick={onClose}
        >
          <ListItemIcon>
            <Dashboard />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton
          component={NavLink}
          to="/cases"
          data-tour="nav-cases"
          sx={{ "&.active": { bgcolor: "action.selected" } }}
          onClick={onClose}
        >
          <ListItemIcon>
            <Assignment />
          </ListItemIcon>
          <ListItemText primary="Cases" />
        </ListItemButton>

        <ListItemButton
          component={NavLink}
          to="/account"
          sx={{ "&.active": { bgcolor: "action.selected" } }}
          onClick={onClose}
        >
          <ListItemIcon>
            <PeopleOutline />
          </ListItemIcon>
          <ListItemText primary="Account" />
        </ListItemButton>
      </List>
    </Box>
  );

  return mdUp ? (
    <Drawer
      variant="permanent"
      open
      sx={{
        "& .MuiDrawer-paper": { width: SIDEBAR_WIDTH },
      }}
    >
      {content}
    </Drawer>
  ) : (
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{ "& .MuiDrawer-paper": { width: SIDEBAR_WIDTH } }}
    >
      {content}
    </Drawer>
  );
};
