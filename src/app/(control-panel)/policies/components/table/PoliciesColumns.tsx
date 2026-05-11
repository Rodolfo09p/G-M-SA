import { GridColDef } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import { PolicyTableRow } from "../../types/types";

const getStatusChipStyles = (statusCode: PolicyTableRow["statusCode"]) => {
  if (statusCode === "new") {
    return {
      backgroundColor: "#e3f2fd",
      color: "#1565c0",
      borderColor: "#90caf9",
    };
  }

  if (statusCode === "renewed") {
    return {
      backgroundColor: "#e8f5e9",
      color: "#2e7d32",
      borderColor: "#a5d6a7",
    };
  }

  if (statusCode === "cancelled") {
    return {
      backgroundColor: "#ffebee",
      color: "#c62828",
      borderColor: "#ef9a9a",
    };
  }

  return {
    backgroundColor: "#ede7f6",
    color: "#5e35b1",
    borderColor: "#b39ddb",
  };
};

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
    minWidth: 130,
    flex: 0.6,
    renderCell: (params) => {
      const statusStyles = getStatusChipStyles(params.row.statusCode);

      return (
        <Chip
          label={params.row.status}
          size="small"
          variant="outlined"
          sx={{
            fontWeight: 700,
            ...statusStyles,
          }}
        />
      );
    },
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
