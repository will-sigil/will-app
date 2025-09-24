import { GridColDef } from "@mui/x-data-grid";
import { Product } from "../../data/grid";
import { Stack, Button, Chip } from "@mui/material";

type Handlers = {
  onShowDetails: (row: Product) => void;
  onScan: (row: Product) => void;
  firstRowId?: string;
};

export const buildProductColumns = ({
  onShowDetails,
  onScan,
  firstRowId,
}: Handlers): GridColDef<Product>[] => [
  { field: "sku", headerName: "SKU", flex: 0.7, minWidth: 120 },
  { field: "name", headerName: "Product", flex: 1.5, minWidth: 220 },
  {
    field: "price",
    headerName: "Price",
    type: "number",
    flex: 0.6,
    minWidth: 110,
  },
  {
    field: "map",
    headerName: "MAP",
    type: "number",
    flex: 0.6,
    minWidth: 110,
  },
  {
    field: "stock",
    headerName: "Stock",
    type: "number",
    flex: 0.5,
    minWidth: 90,
  },
  {
    field: "status",
    headerName: "Status",
    flex: 0.7,
    minWidth: 110,
    renderCell: (p) => (
      <Chip
        size="small"
        label={p.value}
        color={p.value === "Active" ? "success" : "default"}
        variant="outlined"
      />
    ),
  },
  {
    field: "actions",
    headerName: "Actions",
    sortable: false,
    filterable: false,
    align: "right",
    headerAlign: "right",
    flex: 1,
    minWidth: 220,
    renderCell: (params) => {
      const row = params.row;
      const tourAttr = firstRowId ? { "data-tour": "dash-row-action" } : {};
      return (
        <Stack direction="row" spacing={1} {...tourAttr}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => onShowDetails(row)}
          >
            Details
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={() => {
              onScan(row);
            }}
          >
            Scan
          </Button>
        </Stack>
      );
    },
  },
];
