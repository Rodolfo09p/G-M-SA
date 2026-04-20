"use client";

import { ReactNode } from "react";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import {
  DataGrid,
  GridColDef,
  GridInitialState,
  GridValidRowModel,
} from "@mui/x-data-grid";

type CustomDataGridProps<T extends GridValidRowModel> = {
  rows: T[];
  columns: GridColDef<T>[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  rightActions?: ReactNode;
  isLoading?: boolean;
  gridHeight?: number;
  initialState?: GridInitialState;
};

export const CustomDataGrid = <T extends { id: string | number }>(
  props: Readonly<CustomDataGridProps<T>>,
) => {
  const {
    rows,
    columns,
    searchTerm,
    onSearchChange,
    searchPlaceholder = "Search...",
    rightActions,
    isLoading = false,
    gridHeight = 560,
    initialState,
  } = props;

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            md: rightActions ? "minmax(0, 2fr) minmax(0, 1fr)" : "1fr",
          },
          alignItems: "center",
          mb: 2,
        }}
      >
        <TextField
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          fullWidth
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <FuseSvgIcon size={16}>lucide:search</FuseSvgIcon>
                </InputAdornment>
              ),
            },
          }}
        />

        {rightActions && <Box>{rightActions}</Box>}
      </Box>

      <Box sx={{ height: gridHeight, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={isLoading}
          pageSizeOptions={[10, 25, 50]}
          initialState={
            initialState ?? {
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }
          }
          disableRowSelectionOnClick
          sx={{
            border: 0,
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "rgba(0,0,0,0.02)",
              fontWeight: "bold",
            },
          }}
        />
      </Box>
    </Paper>
  );
};
