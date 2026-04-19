"use client";
import { useMemo, useState } from "react";
import FusePageSimple from "@fuse/core/FusePageSimple";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { customersMockData, policiesMockData } from "../../../brokerage/data/brokerageMockData";

const Root = styled(FusePageSimple)(({ theme }) => ({
  "& .FusePageSimple-header": {
    backgroundColor: theme.vars.palette.background.paper,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: theme.vars.palette.divider,
  },
}));

type CustomerTableRow = {
  id: string;
  fullName: string;
  personType: string;
  phoneMobile: string;
//   email: string;
  policyCount: number;
  activePolicyCount: number;
};

export const CustomersView = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const customerRows = useMemo<CustomerTableRow[]>(() => {
    return customersMockData.map((customer) => {
      const customerPolicies = policiesMockData.filter((policy) => policy.customerId === customer.id);
      const activePolicyCount = customerPolicies.filter((policy) => policy.status === "active").length;

      return {
        id: customer.id,
        fullName: customer.fullName,
        personType: customer.personType === "legal" ? "Juridica" : "Natural",
        phoneMobile: customer.phoneMobile,
        // email: customer.email,
        policyCount: customerPolicies.length,
        activePolicyCount,
      };
    });
  }, []);

  const filteredRows = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    if (!normalized) {
      return customerRows;
    }

    return customerRows.filter((row) => row.fullName.toLowerCase().includes(normalized) || row.id.toLowerCase().includes(normalized));
  }, [customerRows, searchTerm]);

  const columns = useMemo<GridColDef<CustomerTableRow>[]>(
    () => [
      { field: "id", headerName: "ID", minWidth: 180, flex: 1 },
      { field: "fullName", headerName: "Cliente", minWidth: 240, flex: 1.2 },
      { field: "personType", headerName: "Tipo", minWidth: 120, flex: 0.7 },
      { field: "phoneMobile", headerName: "Celular", minWidth: 130, flex: 0.8 },
    //   { field: "email", headerName: "Correo", minWidth: 220, flex: 1.2 },
      { field: "policyCount", headerName: "Polizas", minWidth: 100, type: "number", align: "center", headerAlign: "center" },
      {
        field: "activePolicyCount",
        headerName: "Activas",
        minWidth: 110,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Chip
            label={params.value}
            size="small"
            color={Number(params.value) > 0 ? "success" : "default"}
            variant={Number(params.value) > 0 ? "filled" : "outlined"}
          />
        ),
      },
    ],
    []
  );

  return (
    <Root
      header={
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight={600}>
            Clientes
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            CRM base del demo: busqueda por nombre o cedula/RUC.
          </Typography>
        </Box>
      }
      content={
        <Box sx={{ p: 3 }}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <TextField
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar por nombre o cedula/RUC"
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

            <Box sx={{ mt: 2, height: 520 }}>
              <DataGrid
                rows={filteredRows}
                columns={columns}
                pageSizeOptions={[10, 25, 50]}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10, page: 0 },
                  },
                }}
                disableRowSelectionOnClick
                sx={{ border: 0 }}
              />
            </Box>
          </Paper>
        </Box>
      }
    />
  );
};

export default CustomersView;
