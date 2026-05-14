import { Button, Chip, Stack } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { ClaimStatus, ClaimTableRow } from "../../types/types";

const STATUS_COLOR_MAP: Record<
  ClaimStatus,
  "default" | "warning" | "info" | "success" | "error"
> = {
  reported: "warning",
  in_review: "info",
  documents_pending: "warning",
  approved: "success",
  rejected: "error",
  closed: "default",
};

const getClaimsColumns = (
  onViewDetail: (row: ClaimTableRow) => void,
  onAdvanceStatus: (row: ClaimTableRow) => void,
): GridColDef<ClaimTableRow>[] => [
  {
    field: "claimNumber",
    headerName: "No. Reclamo",
    minWidth: 160,
    flex: 0.7,
  },
  {
    field: "customerName",
    headerName: "Cliente",
    minWidth: 220,
    flex: 1,
  },
  {
    field: "status",
    headerName: "Estado",
    minWidth: 170,
    flex: 0.8,
    renderCell: ({ row }) => (
      <Chip
        size="small"
        color={STATUS_COLOR_MAP[row.statusCode]}
        label={row.status}
      />
    ),
  },
  {
    field: "pendingNotifications",
    headerName: "Pendientes",
    minWidth: 120,
    flex: 0.5,
  },
  {
    field: "reportDate",
    headerName: "Fecha reporte",
    minWidth: 140,
    flex: 0.6,
  },
  {
    field: "actions",
    headerName: "Acciones",
    minWidth: 240,
    flex: 1,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: ({ row }) => {
      const disableAdvance =
        row.statusCode === "closed" || row.statusCode === "rejected";

      return (
        <Stack direction="row" spacing={1}>
          <Button size="small" color="info" onClick={() => onViewDetail(row)}>
            Ver detalle
          </Button>
          <Button
            size="small"
            color="success"
            onClick={() => onAdvanceStatus(row)}
            disabled={disableAdvance}
          >
            Avanzar estado
          </Button>
        </Stack>
      );
    },
  },
];

export { getClaimsColumns };
