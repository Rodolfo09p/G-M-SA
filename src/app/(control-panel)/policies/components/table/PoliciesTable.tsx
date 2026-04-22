import { CustomDataGrid } from "@/components";
import { Autocomplete, TextField } from "@mui/material";

export const PoliciesTable = (props) => {
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
