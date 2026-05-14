"use client";

import { useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Typography } from "@mui/material";
import { PageLayout, useAppFeedback } from "@/components";
import { ClaimsTable } from "./components/table/ClaimsTable";
import { useClaimsTable } from "./hooks/useClaimsTable";
import { getClaimsColumns } from "./components/table/ClaimsColumns";
import { assignmentFilterOptions, statusFilterOptions } from "./constants/claimsFilters";
import { ClaimDetailDrawer } from "./components/drawer/ClaimDetailDrawer";
import { NewClaimDialog } from "./components/dialogs/NewClaimDialog";
import { advanceLocalClaimStatus, createLocalClaim } from "./data/claimsMockData";
import { ClaimTableRow } from "./types/types";

const MIN_ACTION_DELAY_MS = 1200;

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });

const ClaimsView = () => {
  const [dataVersion, setDataVersion] = useState(0);
  const [openNewClaimDialog, setOpenNewClaimDialog] = useState(false);
  const { showAlert, showConfirm, showLoading } = useAppFeedback();

  const {
    searchTerm,
    assignmentFilter,
    statusFilter,
    selectedClaim,
    filteredRows,
    setSearchTerm,
    setAssignmentFilter,
    setStatusFilter,
    setSelectedClaim,
  } = useClaimsTable(dataVersion);

  const selectedAssignmentOption = useMemo(() => {
    return (
      assignmentFilterOptions.find((option) => option.value === assignmentFilter) ??
      assignmentFilterOptions[0]
    );
  }, [assignmentFilter]);

  const selectedStatusOption = useMemo(() => {
    return (
      statusFilterOptions.find((option) => option.value === statusFilter) ??
      statusFilterOptions[0]
    );
  }, [statusFilter]);

  const handleAdvanceStatus = async (row: ClaimTableRow) => {
    const confirmed = await showConfirm({
      title: "¿Deseas avanzar el estado del reclamo?",
      text: `Reclamo ${row.claimNumber}`,
      confirmButtonText: "Sí, avanzar",
      cancelButtonText: "Cancelar",
    });

    if (!confirmed) {
      return;
    }

    const closeLoading = showLoading({
      title: "Actualizando estado",
      text: "Por favor, espere...",
    });

    try {
      const result = advanceLocalClaimStatus(row.claimNumber);
      await wait(MIN_ACTION_DELAY_MS);

      if (!result.ok) {
        await showAlert({
          icon: "error",
          title: "No se pudo actualizar",
          text: result.error,
        });
        return;
      }

      await showAlert({
        icon: "success",
        title: "Estado actualizado",
      });
      setDataVersion((current) => current + 1);
    } finally {
      closeLoading();
    }
  };

  const columns = useMemo(
    () => getClaimsColumns(setSelectedClaim, (row) => void handleAdvanceStatus(row)),
    [setSelectedClaim, dataVersion],
  );

  const handleCreateClaim = async (
    payload: Parameters<typeof createLocalClaim>[0],
  ) => {
    const closeLoading = showLoading({
      title: "Registrando reclamo",
      text: "Por favor, espere...",
    });

    try {
      const result = createLocalClaim(payload);
      await wait(MIN_ACTION_DELAY_MS);

      if (!result.ok) {
        await showAlert({
          icon: "error",
          title: "No se pudo registrar el reclamo",
          text: result.error,
        });
        return;
      }

      await showAlert({
        icon: "success",
        title: "Reclamo creado exitosamente",
        text: `No. reclamo ${result.claimNumber}`,
      });
      setOpenNewClaimDialog(false);
      setDataVersion((current) => current + 1);
    } finally {
      closeLoading();
    }
  };

  return (
    <PageLayout
      header={
        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" fontWeight={600}>
            Reclamos (Siniestros)
          </Typography>

          <Button
            variant="contained"
            color="secondary"
            onClick={() => setOpenNewClaimDialog(true)}
          >
            <AddIcon sx={{ mr: 1 }} />
            Nuevo Reclamo
          </Button>
        </Box>
      }
      content={
        <Box sx={{ p: 3 }}>
          <ClaimsTable
            filteredRows={filteredRows}
            columns={columns}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            assignmentFilterOptions={assignmentFilterOptions}
            selectedAssignmentOption={selectedAssignmentOption}
            setAssignmentFilter={setAssignmentFilter}
            statusFilterOptions={statusFilterOptions}
            selectedStatusOption={selectedStatusOption}
            setStatusFilter={setStatusFilter}
          />

          <ClaimDetailDrawer
            selectedClaim={selectedClaim}
            setSelectedClaim={setSelectedClaim}
          />

          <NewClaimDialog
            open={openNewClaimDialog}
            onClose={() => setOpenNewClaimDialog(false)}
            onSave={handleCreateClaim}
          />
        </Box>
      }
    />
  );
};

export default ClaimsView;