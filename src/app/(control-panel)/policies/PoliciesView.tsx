"use client";
import { useMemo } from "react";
import { PageLayout } from "@/components";
import { Box, Typography } from "@mui/material";
import { PoliciesTable } from "./components/table/PoliciesTable";
import { PoliciesDetailDrawer } from "./components/drawer/PoliciesDetailDrawer";
import { usePoliciesTable } from "./hooks/usePoliciesTable";
import { getPoliciesColumns } from "./components/table/PoliciesColumns";
import { assignmentFilterOptions } from "./constants/policiesFilter";

export const PoliciesView = () => {
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
  return (
    <PageLayout
      header={
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight={600}>
            Pólizas
          </Typography>
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
        </Box>
      }
    />
  );
};

export default PoliciesView;
