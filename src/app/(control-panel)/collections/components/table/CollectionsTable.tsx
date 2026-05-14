import { CustomDataGrid } from "@/components";
import { Autocomplete, Stack, TextField } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import type { CollectionCaseView } from "../../types/types";

type FilterOption = {
  label: string;
  value: string;
};

type CollectionsTableProps = {
  rows: CollectionCaseView[];
  columns: GridColDef<CollectionCaseView>[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  syncOptions: FilterOption[];
  selectedSyncOption: FilterOption;
  onSyncChange: (value: string) => void;
};

export const CollectionsTable = (props: Readonly<CollectionsTableProps>) => {
  const {
    rows,
    columns,
    searchTerm,
    onSearchChange,
    syncOptions,
    selectedSyncOption,
    onSyncChange,
  } = props;

  return (
    <CustomDataGrid
      rows={rows}
      columns={columns}
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      searchPlaceholder="Buscar por cliente, cédula, póliza o cuota"
      initialState={{
        pagination: {
          paginationModel: { pageSize: 5, page: 0 },
        },
      }}
      rightActions={
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
          <Autocomplete
            options={syncOptions}
            getOptionLabel={(option) => option.label}
            value={selectedSyncOption}
            onChange={(_event, option) => onSyncChange(option?.value ?? "all")}
            disableClearable
            sx={{ minWidth: 170 }}
            renderInput={(params) => <TextField {...params} label="Sync" />}
          />
        </Stack>
      }
    />
  );
};
