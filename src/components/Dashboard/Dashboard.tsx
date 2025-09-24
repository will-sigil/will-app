import * as React from "react";
import {
  Box,
  Stack,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Logout } from "../Auth/Logout/Logout";
import { Product, demoRows } from "../../data/grid";
import { buildProductColumns } from "./GridColDef";

export const Dashboard: React.FC = () => {
  const [rows] = React.useState<Product[]>(demoRows);
  const [detail, setDetail] = React.useState<Product | null>(null);
  const [scanOpen, setScanOpen] = React.useState(false);

  const columns = React.useMemo(
    () =>
      buildProductColumns({
        onShowDetails: setDetail,
        onScan: () => {
          setScanOpen(true);
        },
        firstRowId: rows[0]?.id,
      }),
    [rows]
  );

  return (
    <Box>
      <Box sx={{ px: 3, py: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography variant="h5">Products</Typography>
          <Stack direction="row" spacing={1}>
            <Button
              data-tour="dash-start-tour"
              variant="text"
              onClick={() => window.dispatchEvent(new Event("start-tour"))}
            >
              Start tour
            </Button>
            <Button
              data-tour="dash-add-product"
              variant="contained"
              onClick={() => {}}
            >
              Add Product
            </Button>
          </Stack>
        </Stack>

        <div data-tour="dash-products-grid">
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(r) => r.id}
            autoHeight
            density="comfortable"
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: { paginationModel: { pageSize: 5, page: 0 } },
            }}
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar }}
          />
        </div>

        <Box sx={{ mt: 2 }}>
          <Logout />
        </Box>
      </Box>

      <Dialog
        open={!!detail && !scanOpen}
        onClose={() => setDetail(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Product Details</DialogTitle>
        <DialogContent dividers>
          {detail && (
            <>
              <Typography variant="subtitle2">Name</Typography>
              <Typography gutterBottom>{detail.name}</Typography>

              <Typography variant="subtitle2">SKU</Typography>
              <Typography gutterBottom>{detail.sku}</Typography>

              <Typography variant="subtitle2">Price / MAP</Typography>
              <Typography gutterBottom>
                ${detail.price} / ${detail.map}
              </Typography>

              <Typography variant="subtitle2">Stock</Typography>
              <Typography gutterBottom>{detail.stock}</Typography>

              <Typography variant="subtitle2">Status</Typography>
              <Typography gutterBottom>{detail.status}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetail(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={scanOpen}
        onClose={() => setScanOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Scan queued</DialogTitle>
        <DialogActions>
          <Button onClick={() => setScanOpen(false)}>OK</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
