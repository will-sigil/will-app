import * as React from "react";
import {
  Box,
  Stack,
  Typography,
  Card,
  CardContent,
  Button,
} from "@mui/material";

export const CasesPage: React.FC = () => {
  return (
    <Box sx={{ px: 3, py: 2 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" data-tour="cases-title">
          Cases
        </Typography>
        <Button variant="contained" data-tour="cases-refresh">
          Refresh
        </Button>
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Card sx={{ flex: 1 }} data-tour="cases-kpi-1">
          <CardContent>
            <Typography variant="overline">Open Cases</Typography>
            <Typography variant="h4">42</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }} data-tour="cases-kpi-2">
          <CardContent>
            <Typography variant="overline">New (24h)</Typography>
            <Typography variant="h4">7</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }} data-tour="cases-kpi-3">
          <CardContent>
            <Typography variant="overline">Resolved (7d)</Typography>
            <Typography variant="h4">18</Typography>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};
