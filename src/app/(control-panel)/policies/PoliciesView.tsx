"use client";
import { useMemo, useState } from "react";
import { PageLayout, useAppFeedback } from "@/components";
import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { PoliciesTable } from "./components/table/PoliciesTable";
import { PoliciesDetailDrawer } from "./components/drawer/PoliciesDetailDrawer";
import { usePoliciesTable } from "./hooks/usePoliciesTable";
import { getPoliciesColumns } from "./components/table/PoliciesColumns";
import { assignmentFilterOptions, statusFilterOptions } from "./constants/policiesFilter";
import {
  NewManagementDialog,
  type ManagementFlow,
} from "./components/dialogs/NewManagementDialog";
import { NewPolicyWizardDialog } from "./components/dialogs/NewPolicyWizardDialog";
import { AddPolicyToExistingCustomerWizardDialog } from "./components/dialogs/AddPolicyToExistingCustomerWizardDialog";
import { addLocalPolicyFromWizard } from "./helpers/addLocalPolicyFromWizard";
import { RenewPolicyWizardDialog } from "./components/dialogs/RenewPolicyWizardDialog";
import { renewLocalPolicyFromWizard } from "./helpers/renewLocalPolicyFromWizard";
import { cancelLocalPolicy } from "./helpers/cancelLocalPolicy";
import type { PolicyTableRow } from "./types/types";

const MIN_CREATE_POLICY_DELAY_MS = 2000;

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });

export const PoliciesView = () => {
  const [openNewManagement, setOpenNewManagement] = useState(false);
  const [openNewPolicyWizard, setOpenNewPolicyWizard] = useState(false);
  const [openAddPolicyWizard, setOpenAddPolicyWizard] = useState(false);
  const [openRenewPolicyWizard, setOpenRenewPolicyWizard] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);
  const { showLoading, showAlert, showConfirm } = useAppFeedback();

  const {
    assignmentFilter,
    statusFilter,
    searchTerm,
    selectedPolicy,
    setSelectedPolicy,
    setAssignmentFilter,
    setStatusFilter,
    setSearchTerm,
    filteredRows,
  } = usePoliciesTable();

  const columns = useMemo(
    () => getPoliciesColumns(setSelectedPolicy, (row) => {
      void handleCancelPolicy(row);
    }),
    [setSelectedPolicy, dataVersion],
  );

  const selectedAssignmentOption = useMemo(() => {
    return (
      assignmentFilterOptions.find(
        (option) => option.value === assignmentFilter,
      ) ?? assignmentFilterOptions[0]
    );
  }, [assignmentFilter]);

  const selectedStatusOption = useMemo(() => {
    return (
      statusFilterOptions.find((option) => option.value === statusFilter) ??
      statusFilterOptions[0]
    );
  }, [statusFilter]);

  const handleSelectManagementFlow = (flow: ManagementFlow) => {
    if (flow === "new_customer_policy") {
      setOpenNewPolicyWizard(true);
    }

    if (flow === "add_policy") {
      setOpenAddPolicyWizard(true);
    }

    if (flow === "renew_policy") {
      setOpenRenewPolicyWizard(true);
    }

    setOpenNewManagement(false);
  };

  const handleSavePolicy = async (payload: Parameters<typeof addLocalPolicyFromWizard>[0]) => {
    const closeLoading = showLoading({
      title: "Creando póliza",
      text: "Por favor, espere...",
    });

    try {
      const result = addLocalPolicyFromWizard(payload);
      await wait(MIN_CREATE_POLICY_DELAY_MS);

      if (!result.ok) {
        await showAlert({
          icon: "error",
          title: "No se pudo crear la póliza",
          text: result.error,
        });
        throw new Error(result.error);
      }

      await showAlert({
        icon: "success",
        title: "Póliza creada exitosamente",
      });
      setOpenNewPolicyWizard(false);
      setOpenAddPolicyWizard(false);
      setDataVersion((current) => current + 1);
    } finally {
      closeLoading();
    }
  };

  const handleRenewPolicy = async (
    renewal: Parameters<typeof renewLocalPolicyFromWizard>[0],
  ) => {
    const closeLoading = showLoading({
      title: "Renovando póliza",
      text: "Por favor, espere...",
    });

    try {
      const result = renewLocalPolicyFromWizard(renewal);
      await wait(MIN_CREATE_POLICY_DELAY_MS);

      if (!result.ok) {
        await showAlert({
          icon: "error",
          title: "No se pudo renovar la póliza",
          text: result.error,
        });
        throw new Error(result.error);
      }

      await showAlert({
        icon: "success",
        title: "Póliza renovada exitosamente",
      });
      setOpenRenewPolicyWizard(false);
      setDataVersion((current) => current + 1);
    } finally {
      closeLoading();
    }
  };

  const handleCancelPolicy = async (row: PolicyTableRow) => {
    const confirmed = await showConfirm({
      title: "¿Estás seguro de anular esta póliza?",
      text: "Esta acción no se podrá revertir.",
      confirmButtonText: "Sí, anular",
      cancelButtonText: "Cancelar",
    });

    if (!confirmed) {
      return;
    }

    const closeLoading = showLoading({
      title: "Anulando póliza",
      text: "Por favor, espere...",
    });

    try {
      const result = cancelLocalPolicy(row.policyNumber);
      await wait(MIN_CREATE_POLICY_DELAY_MS);

      if (!result.ok) {
        await showAlert({
          icon: "error",
          title: "No se pudo anular la póliza",
          text: result.error,
        });
        return;
      }

      await showAlert({
        icon: "success",
        title: "Póliza anulada",
      });
      setSelectedPolicy(null);
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
            Pólizas
          </Typography>

          <Button
            variant="contained"
            color="secondary"
            onClick={() => setOpenNewManagement(true)}
          >
            <AddIcon sx={{ mr: 1 }} />
            Nueva Gestión
          </Button>
        </Box>
      }
      content={
        <Box sx={{ p: 3 }}>
          <PoliciesTable
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
          <PoliciesDetailDrawer
            selectedPolicy={selectedPolicy}
            setSelectedPolicy={setSelectedPolicy}
          />
          <NewManagementDialog
            open={openNewManagement}
            onClose={() => setOpenNewManagement(false)}
            onSelect={handleSelectManagementFlow}
          />
          <NewPolicyWizardDialog
            open={openNewPolicyWizard}
            onClose={() => setOpenNewPolicyWizard(false)}
            onSave={handleSavePolicy}
          />
          <AddPolicyToExistingCustomerWizardDialog
            open={openAddPolicyWizard}
            onClose={() => setOpenAddPolicyWizard(false)}
            onSave={handleSavePolicy}
          />
          <RenewPolicyWizardDialog
            open={openRenewPolicyWizard}
            onClose={() => setOpenRenewPolicyWizard(false)}
            onSave={handleRenewPolicy}
          />
        </Box>
      }
    />
  );
};

export default PoliciesView;
