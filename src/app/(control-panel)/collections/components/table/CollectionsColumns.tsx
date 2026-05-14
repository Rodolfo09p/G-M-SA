import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import type { CollectionCaseView } from "../../types/types";

const getSyncChipStyles = (syncState: CollectionCaseView["syncState"]) => {
  if (syncState === "new") {
    return {
      backgroundColor: "#fff3e0",
      color: "#ef6c00",
      borderColor: "#ffcc80",
    };
  }

  if (syncState === "updated") {
    return {
      backgroundColor: "#e3f2fd",
      color: "#1565c0",
      borderColor: "#90caf9",
    };
  }

  if (syncState === "recovered") {
    return {
      backgroundColor: "#e8f5e9",
      color: "#2e7d32",
      borderColor: "#a5d6a7",
    };
  }

  return {
    backgroundColor: "#f5f5f5",
    color: "#616161",
    borderColor: "#e0e0e0",
  };
};

const getStageChipStyles = (
  stage: CollectionCaseView["operationalStage"],
) => {
  if (stage === "pending_first_call") {
    return {
      backgroundColor: "#fff8e1",
      color: "#f57f17",
      borderColor: "#ffe082",
    };
  }

  if (stage === "in_follow_up") {
    return {
      backgroundColor: "#e3f2fd",
      color: "#1565c0",
      borderColor: "#90caf9",
    };
  }

  if (stage === "promise_to_pay") {
    return {
      backgroundColor: "#e8f5e9",
      color: "#2e7d32",
      borderColor: "#a5d6a7",
    };
  }

  if (stage === "escalated") {
    return {
      backgroundColor: "#ffebee",
      color: "#c62828",
      borderColor: "#ef9a9a",
    };
  }

  return {
    backgroundColor: "#f3e5f5",
    color: "#6a1b9a",
    borderColor: "#ce93d8",
  };
};

const syncLabelMap: Record<CollectionCaseView["syncState"], string> = {
  new: "Nuevo",
  persistent: "Persistente",
  updated: "Actualizado",
  recovered: "Recuperado",
};

const stageLabelMap: Record<CollectionCaseView["operationalStage"], string> = {
  pending_first_call: "Primer contacto",
  in_follow_up: "Seguimiento",
  promise_to_pay: "Promesa",
  escalated: "Escalado",
  recovered: "Recuperado",
};

export const getCollectionsColumns = (
  onSelectCase: (caseId: string) => void,
): GridColDef<CollectionCaseView>[] => {
  return [
    {
      field: "customerName",
      headerName: "Cliente",
      minWidth: 230,
      flex: 1.3,
      renderCell: ({ row }) => (
        <Stack spacing={0.2} sx={{ py: 1 }}>
          <Typography variant="body2" fontWeight={600}>
            {row.customerName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.customerId}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "overdueDays",
      headerName: "Días mora",
      minWidth: 105,
      align: "center",
      headerAlign: "center",
      flex: 0.55,
    },
    {
      field: "syncState",
      headerName: "Sync",
      minWidth: 115,
      flex: 0.7,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Chip
            size="small"
            variant="outlined"
            label={syncLabelMap[row.syncState]}
            sx={{ fontWeight: 700, ...getSyncChipStyles(row.syncState) }}
          />
        </Box>
      ),
    },
    {
      field: "operationalStage",
      headerName: "Gestión",
      minWidth: 130,
      flex: 0.8,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Chip
            size="small"
            variant="outlined"
            label={stageLabelMap[row.operationalStage]}
            sx={{ fontWeight: 700, ...getStageChipStyles(row.operationalStage) }}
          />
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      minWidth: 155,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <Box
          sx={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <Button
            size="small"
            variant="text"
            color="info"
            onClick={(event) => {
              event.stopPropagation();
              onSelectCase(row.id);
            }}
          >
            Ver detalle
          </Button>
        </Box>
      ),
    },
  ];
};
