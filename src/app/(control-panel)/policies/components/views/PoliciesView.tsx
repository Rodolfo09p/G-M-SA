"use client";
import { useMemo, useState } from "react";
import FusePageSimple from "@fuse/core/FusePageSimple";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import {
  customersMockData,
  policiesMockData,
  policyFinancesMockData,
} from "../../../brokerage/data/brokerageMockData";
import { AssignmentType } from "../../../brokerage/types/brokerageTypes";

const Root = styled(FusePageSimple)(({ theme }) => ({
  "& .FusePageSimple-header": {
    backgroundColor: theme.vars.palette.background.paper,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: theme.vars.palette.divider,
  },
}));

type PolicyTableRow = {
  id: string;
  policyNumber: string;
  customerName: string;
  branch: string;
  insuranceCompany: string;
  status: string;
  assignedTo: string;
  assignmentType: AssignmentType;
  startDate: string;
  endDate: string;
  insuredAssetDescription: string;
  customerId: string;
  paymentMethod: string;
  installments: number;
  installmentValue: number;
  netPremium: number;
  insuredSum: number;
  totalPremium: number;
  currency: string;
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <Box sx={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 1 }}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2">{value}</Typography>
  </Box>
);

export const PoliciesView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [assignmentFilter, setAssignmentFilter] = useState<"all" | AssignmentType>("all");
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyTableRow | null>(null);

  const policyRows = useMemo<PolicyTableRow[]>(() => {
    return policiesMockData.map((policy) => {
      const customer = customersMockData.find((item) => item.id === policy.customerId);
      const finance = policyFinancesMockData.find((item) => item.policyNumber === policy.policyNumber);

      return {
        id: policy.policyNumber,
        policyNumber: policy.policyNumber,
        customerName: customer?.fullName ?? "Sin cliente",
        branch: policy.branch,
        insuranceCompany: policy.insuranceCompany,
        status: policy.status === "active" ? "Activa" : "Anulada",
        assignedTo: policy.assignedTo,
        assignmentType: policy.assignmentType,
        startDate: policy.startDate,
        endDate: policy.endDate,
        insuredAssetDescription: policy.insuredAssetDescription,
        customerId: customer?.id ?? policy.customerId,
        paymentMethod: finance?.paymentMethod ?? "N/A",
        installments: finance?.installments ?? 0,
        installmentValue: finance?.installmentValue ?? 0,
        netPremium: finance?.netPremium ?? 0,
        insuredSum: finance?.insuredSum ?? 0,
        totalPremium: finance?.totalPremium ?? 0,
        currency: finance?.currency ?? "USD",
      };
    });
  }, []);

  const filteredRows = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    return policyRows.filter((row) => {
      const matchesSearch =
        !normalized ||
        row.policyNumber.toLowerCase().includes(normalized) ||
        row.customerName.toLowerCase().includes(normalized) ||
        row.branch.toLowerCase().includes(normalized);

      const matchesAssignment = assignmentFilter === "all" || row.assignmentType === assignmentFilter;

      return matchesSearch && matchesAssignment;
    });
  }, [policyRows, searchTerm, assignmentFilter]);

  const columns = useMemo<GridColDef<PolicyTableRow>[]>(
    () => [
      { field: "policyNumber", headerName: "No. Poliza", minWidth: 150, flex: 0.85 },
      { field: "customerName", headerName: "Cliente", minWidth: 220, flex: 1.4 },
      { field: "status", headerName: "Estado", minWidth: 110, flex: 0.7 },
      { field: "endDate", headerName: "Vence", minWidth: 110, flex: 0.7 },
      {
        field: "totalPremium",
        headerName: "Prima Total",
        minWidth: 140,
        flex: 0.85,
        align: "right",
        headerAlign: "right",
        valueFormatter: (_value, row) => `${row.currency} ${row.totalPremium.toFixed(2)}`,
      },
      {
        field: "actions",
        headerName: "Acciones",
        minWidth: 120,
        flex: 0.7,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <Button
            size="small"
            variant="text"
            color="info"
            onClick={(event) => {
              event.stopPropagation();
              setSelectedPolicy(params.row);
            }}
          >
            Ver detalle
          </Button>
        ),
      },
    ],
    []
  );

  const handleAssignmentFilterChange = (event: SelectChangeEvent<"all" | AssignmentType>) => {
    setAssignmentFilter(event.target.value as "all" | AssignmentType);
  };

  return (
    <Root
      header={
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight={600}>
            Polizas
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Gestion del contrato y filtro por asignacion: G&M o Subagente.
          </Typography>
        </Box>
      }
      content={
        <Box sx={{ p: 3 }}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "minmax(0, 2fr) minmax(0, 1fr)",
                },
                alignItems: "center",
              }}
            >
              <TextField
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar por poliza, cliente o ramo"
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

              <FormControl fullWidth size="small">
                <InputLabel id="assignment-filter-label">Asignacion</InputLabel>
                <Select
                  labelId="assignment-filter-label"
                  value={assignmentFilter}
                  label="Asignacion"
                  onChange={handleAssignmentFilterChange}
                >
                  <MenuItem value="all">Todas</MenuItem>
                  <MenuItem value="gym">G&M</MenuItem>
                  <MenuItem value="agent">Subagente</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mt: 2, height: 560 }}>
              <DataGrid
                rows={filteredRows}
                columns={columns}
                pageSizeOptions={[10, 25, 50]}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10, page: 0 },
                  },
                  sorting: {
                    sortModel: [{ field: "endDate", sort: "asc" }],
                  },
                }}
                disableRowSelectionOnClick
                sx={{ border: 0 }}
              />
            </Box>
          </Paper>

          <Drawer
            anchor="right"
            open={Boolean(selectedPolicy)}
            onClose={() => setSelectedPolicy(null)}
            slotProps={{ paper: { sx: { width: { xs: "100%", sm: 420 } } } }}
          >
            {selectedPolicy && (
              <Box sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="h6" fontWeight={600}>
                    Detalle de poliza
                  </Typography>
                  <IconButton onClick={() => setSelectedPolicy(null)} size="small">
                    <FuseSvgIcon size={18}>lucide:x</FuseSvgIcon>
                  </IconButton>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {selectedPolicy.policyNumber}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={1.25}>
                  <DetailRow label="Cliente" value={selectedPolicy.customerName} />
                  <DetailRow label="ID cliente" value={selectedPolicy.customerId} />
                  <DetailRow label="Ramo" value={selectedPolicy.branch} />
                  <DetailRow label="Compania" value={selectedPolicy.insuranceCompany} />
                  <DetailRow label="Asignado" value={selectedPolicy.assignedTo} />
                  <DetailRow label="Estado" value={selectedPolicy.status} />
                  <DetailRow label="Inicio" value={selectedPolicy.startDate} />
                  <DetailRow label="Fin" value={selectedPolicy.endDate} />
                  <DetailRow label="Suma asegurada" value={`${selectedPolicy.currency} ${selectedPolicy.insuredSum.toFixed(2)}`} />
                  <DetailRow label="Prima neta" value={`${selectedPolicy.currency} ${selectedPolicy.netPremium.toFixed(2)}`} />
                  <DetailRow label="Prima total" value={`${selectedPolicy.currency} ${selectedPolicy.totalPremium.toFixed(2)}`} />
                  <DetailRow label="Forma de pago" value={selectedPolicy.paymentMethod} />
                  <DetailRow label="Cuotas" value={`${selectedPolicy.installments}`} />
                  <DetailRow label="Valor cuota" value={`${selectedPolicy.currency} ${selectedPolicy.installmentValue.toFixed(2)}`} />
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Typography variant="caption" color="text.secondary">
                  Descripcion del bien
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {selectedPolicy.insuredAssetDescription}
                </Typography>
              </Box>
            )}
          </Drawer>
        </Box>
      }
    />
  );
};

export default PoliciesView;
