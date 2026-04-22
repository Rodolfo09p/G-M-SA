import { GridColDef } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { PolicyTableRow } from "../../types/types";

export const getPoliciesColumns = (
  onViewDetail: (row: PolicyTableRow) => void,
): GridColDef<PolicyTableRow>[] => [
  {
    field: "policyNumber",
    headerName: "No. Poliza",
    minWidth: 150,
    flex: 0.85,
  },
  {
    field: "customerName",
    headerName: "Cliente",
    minWidth: 220,
    flex: 1.4,
  },
  {
    field: "status",
    headerName: "Estado",
    minWidth: 110,
    flex: 0.6,
  },
  {
    field: "endDate",
    headerName: "Vence",
    minWidth: 110,
    flex: 0.6,
  },
  {
    field: "totalPremium",
    headerName: "Prima Total",
    minWidth: 140,
    flex: 0.6,
    valueFormatter: (_value, row) =>
      `${row.currency} ${row.totalPremium.toFixed(2)}`,
  },
  {
    field: "actions",
    headerName: "Acciones",
    minWidth: 180,
    flex: 0.5,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: (params) => (
      <Button
        size="small"
        variant="text"
        color="info"
        onClick={(event) => {
          event.stopPropagation();
          onViewDetail(params.row);
        }}
      >
        Ver detalle
      </Button>
    ),
  },
];
