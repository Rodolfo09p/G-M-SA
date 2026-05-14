import { AssignmentType } from "@/app/(control-panel)/brokerage/types/brokerageTypes";
import { CustomDataGrid } from "@/components";
import { Autocomplete, Stack, TextField } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { ClaimStatus, ClaimTableRow } from "../../types/types";

type AssignmentOption = {
  label: string;
  value: "all" | AssignmentType;
};

type StatusOption = {
  label: string;
  value: "all" | ClaimStatus;
};

type ClaimsTableProps = {
  filteredRows: ClaimTableRow[];
  columns: GridColDef<ClaimTableRow>[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  assignmentFilterOptions: AssignmentOption[];
  selectedAssignmentOption: AssignmentOption;
  setAssignmentFilter: (value: AssignmentOption["value"]) => void;
  statusFilterOptions: StatusOption[];
  selectedStatusOption: StatusOption;
  setStatusFilter: (value: StatusOption["value"]) => void;
};

const ClaimsTable = (props: ClaimsTableProps) => {
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
      searchPlaceholder="Buscar por reclamo, póliza, cliente o cédula"
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
            onChange={(_event, option) => setStatusFilter(option?.value ?? "all")}
            disableClearable
            size="medium"
            sx={{ minWidth: 220 }}
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

export { ClaimsTable };