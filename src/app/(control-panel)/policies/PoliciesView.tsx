"use client";
import { useMemo, useState } from "react";
import { PageLayout, useAppFeedback } from "@/components";
import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { PoliciesTable } from "./components/table/PoliciesTable";
import { PoliciesDetailDrawer } from "./components/drawer/PoliciesDetailDrawer";
import { usePoliciesTable } from "./hooks/usePoliciesTable";
import { getPoliciesColumns } from "./components/table/PoliciesColumns";
import { assignmentFilterOptions } from "./constants/policiesFilter";
import {
  NewManagementDialog,
  type ManagementFlow,
} from "./components/dialogs/NewManagementDialog";
import { NewPolicyWizardDialog } from "./components/dialogs/NewPolicyWizardDialog";
import { AddPolicyToExistingCustomerWizardDialog } from "./components/dialogs/AddPolicyToExistingCustomerWizardDialog";
import { addLocalPolicyFromWizard } from "./helpers/addLocalPolicyFromWizard";

const MIN_CREATE_POLICY_DELAY_MS = 2000;

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });

export const PoliciesView = () => {
  const [openNewManagement, setOpenNewManagement] = useState(false);
  const [openNewPolicyWizard, setOpenNewPolicyWizard] = useState(false);
  const [openAddPolicyWizard, setOpenAddPolicyWizard] = useState(false);
  const { showLoading, showAlert } = useAppFeedback();

  const {
    assignmentFilter,
    searchTerm,
    selectedPolicy,
    setSelectedPolicy,
    setAssignmentFilter,
    setSearchTerm,
    filteredRows,
  } = usePoliciesTable();

  const columns = useMemo(
    () => getPoliciesColumns(setSelectedPolicy),
    [setSelectedPolicy],
  );

  const selectedAssignmentOption = useMemo(() => {
    return (
      assignmentFilterOptions.find(
        (option) => option.value === assignmentFilter,
      ) ?? assignmentFilterOptions[0]
    );
  }, [assignmentFilter]);

  const handleSelectManagementFlow = (flow: ManagementFlow) => {
    if (flow === "new_customer_policy") {
      setOpenNewPolicyWizard(true);
    }

    if (flow === "add_policy") {
      setOpenAddPolicyWizard(true);
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
        </Box>
      }
    />
  );
};

export default PoliciesView;
