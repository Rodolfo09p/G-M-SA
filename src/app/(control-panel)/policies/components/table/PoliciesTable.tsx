import { AssignmentType } from "@/app/(control-panel)/brokerage/types/brokerageTypes";
import { CustomDataGrid } from "@/components";
import { Autocomplete, TextField } from "@mui/material";
import { PolicyTableRow } from "../../types/types";
import { GridColDef } from "@mui/x-data-grid";

type AssignmentFilterValue = "all" | AssignmentType;

type AssignmentOption = {
  label: string;
  value: AssignmentFilterValue;
};

type PoliciesTableProps = {
  filteredRows: PolicyTableRow[];
  columns: GridColDef<PolicyTableRow>[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  assignmentFilterOptions: AssignmentOption[];
  selectedAssignmentOption: AssignmentOption;
  setAssignmentFilter: (value: AssignmentFilterValue) => void;
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
  } = props;
  return (
    <CustomDataGrid
      rows={filteredRows}
      columns={columns}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Buscar por póliza, cliente o ramo"
      rightActions={
        <Autocomplete
          options={assignmentFilterOptions}
          getOptionLabel={(option) => option.label}
          value={selectedAssignmentOption}
          onChange={(_event, option) =>
            setAssignmentFilter(option?.value ?? "all")
          }
          disableClearable
          size="medium"
          sx={{ minWidth: 240 }}
          renderInput={(params) => <TextField {...params} label="Asignación" />}
        />
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
