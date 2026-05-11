import { AssignmentType } from "@/app/(control-panel)/brokerage/types/brokerageTypes";
import { CustomDataGrid } from "@/components";
import { Autocomplete, Stack, TextField } from "@mui/material";
import { PolicyTableRow } from "../../types/types";
import { GridColDef } from "@mui/x-data-grid";
import type { PolicyEntity } from "@/app/(control-panel)/brokerage/types/brokerageTypes";

type AssignmentFilterValue = "all" | AssignmentType;

type AssignmentOption = {
  label: string;
  value: AssignmentFilterValue;
};

type StatusFilterValue = "all" | PolicyEntity["status"];

type StatusOption = {
  label: string;
  value: StatusFilterValue;
};

type PoliciesTableProps = {
  filteredRows: PolicyTableRow[];
  columns: GridColDef<PolicyTableRow>[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  assignmentFilterOptions: AssignmentOption[];
  selectedAssignmentOption: AssignmentOption;
  setAssignmentFilter: (value: AssignmentFilterValue) => void;
  statusFilterOptions: StatusOption[];
  selectedStatusOption: StatusOption;
  setStatusFilter: (value: StatusFilterValue) => void;
};

export const PoliciesTable = (props: PoliciesTableProps) => {
  const {
    filteredRows,
    columns,
    searchTerm,
    setSearchTerm,
    assignmentFilterOptions,
    selectedAssignmentOption,
    setAssignmentFilter,
    statusFilterOptions,
    selectedStatusOption,
    setStatusFilter,
  } = props;
  return (
    <CustomDataGrid
      rows={filteredRows}
      columns={columns}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Buscar por póliza, cliente o ramo"
      rightActions={
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
          <Autocomplete
            options={assignmentFilterOptions}
            getOptionLabel={(option) => option.label}
            value={selectedAssignmentOption}
            onChange={(_event, option) =>
              setAssignmentFilter(option?.value ?? "all")
            }
            disableClearable
            size="medium"
            sx={{ minWidth: 170 }}
            renderInput={(params) => <TextField {...params} label="Asignación" />}
          />
          <Autocomplete
            options={statusFilterOptions}
            getOptionLabel={(option) => option.label}
            value={selectedStatusOption}
            onChange={(_event, option) =>
              setStatusFilter(option?.value ?? "all")
            }
            disableClearable
            size="medium"
            sx={{ minWidth: 200 }}
            renderInput={(params) => <TextField {...params} label="Estado" />}
          />
        </Stack>
      }
      gridHeight={560}
      initialState={{
        pagination: {
          paginationModel: { pageSize: 5, page: 0 },
        },
      }}
    />
  );
};
