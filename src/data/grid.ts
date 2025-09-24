export type Product = {
  id: string;
  sku: string;
  name: string;
  price: number;
  map: number;
  stock: number;
  status: "Active" | "Paused";
};

export const demoRows: Product[] = [
  {
    id: "P-1001",
    sku: "MET-001",
    name: "MetroVac Pro",
    price: 129.99,
    map: 119.99,
    stock: 24,
    status: "Active",
  },
  {
    id: "P-1002",
    sku: "MET-002",
    name: "MetroVac Mini",
    price: 79.0,
    map: 69.99,
    stock: 8,
    status: "Active",
  },
  {
    id: "P-1003",
    sku: "MET-003",
    name: "MetroVac Turbo",
    price: 199.99,
    map: 179.99,
    stock: 3,
    status: "Paused",
  },
  {
    id: "P-1004",
    sku: "MET-004",
    name: "MetroVac Deluxe",
    price: 149.99,
    map: 139.99,
    stock: 46,
    status: "Active",
  },
  {
    id: "P-1005",
    sku: "MET-005",
    name: "MetroVac Lite",
    price: 59.99,
    map: 54.99,
    stock: 0,
    status: "Paused",
  },
];
