import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <Box sx={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 1 }}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2">{value}</Typography>
  </Box>
);

export const PoliciesDetailDrawer = (props) => {
  const { selectedPolicy, setSelectedPolicy } = props;

  return (
    <Drawer
      anchor="right"
      open={Boolean(selectedPolicy)}
      onClose={() => setSelectedPolicy(null)}
      slotProps={{ paper: { sx: { width: { xs: "100%", sm: 420 } } } }}
    >
      {selectedPolicy && (
        <Box sx={{ p: 2.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
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
            <DetailRow
              label="Compania"
              value={selectedPolicy.insuranceCompany}
            />
            <DetailRow label="Asignado" value={selectedPolicy.assignedTo} />
            <DetailRow label="Estado" value={selectedPolicy.status} />
            <DetailRow label="Inicio" value={selectedPolicy.startDate} />
            <DetailRow label="Fin" value={selectedPolicy.endDate} />
            <DetailRow
              label="Suma asegurada"
              value={`${selectedPolicy.currency} ${selectedPolicy.insuredSum.toFixed(2)}`}
            />
            <DetailRow
              label="Prima neta"
              value={`${selectedPolicy.currency} ${selectedPolicy.netPremium.toFixed(2)}`}
            />
            <DetailRow
              label="Prima total"
              value={`${selectedPolicy.currency} ${selectedPolicy.totalPremium.toFixed(2)}`}
            />
            <DetailRow
              label="Forma de pago"
              value={selectedPolicy.paymentMethod}
            />
            <DetailRow
              label="Cuotas"
              value={`${selectedPolicy.installments}`}
            />
            <DetailRow
              label="Valor cuota"
              value={`${selectedPolicy.currency} ${selectedPolicy.installmentValue.toFixed(2)}`}
            />
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
  );
};
