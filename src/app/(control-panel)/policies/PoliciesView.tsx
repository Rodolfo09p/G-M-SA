"use client";
import { useMemo, useState } from "react";
import { PageLayout } from "@/components";
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

export const PoliciesView = () => {
  const [openNewManagement, setOpenNewManagement] = useState(false);
  const [openNewPolicyWizard, setOpenNewPolicyWizard] = useState(false);

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

    setOpenNewManagement(false);
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
            onSave={(_payload) => {
              setOpenNewPolicyWizard(false);
            }}
          />
        </Box>
      }
    />
  );
};

export default PoliciesView;
