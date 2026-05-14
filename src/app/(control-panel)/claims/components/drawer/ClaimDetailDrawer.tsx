import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import {
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { ClaimNotification, ClaimTableRow } from "../../types/types";

type ClaimDetailDrawerProps = {
  selectedClaim: ClaimTableRow | null;
  setSelectedClaim: (claim: ClaimTableRow | null) => void;
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <Box sx={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 1 }}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2">{value}</Typography>
  </Box>
);

const groupNotifications = (notifications: ClaimNotification[]) => {
  return notifications.reduce<Record<string, ClaimNotification[]>>(
    (acc, item) => {
      const key = item.category;

      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(item);
      return acc;
    },
    {},
  );
};

const ClaimDetailDrawer = (props: ClaimDetailDrawerProps) => {
  const { selectedClaim, setSelectedClaim } = props;

  if (!selectedClaim) {
    return (
      <Drawer
        anchor="right"
        open={false}
        onClose={() => setSelectedClaim(null)}
        slotProps={{ paper: { sx: { width: { xs: "100%", sm: 450 } } } }}
      />
    );
  }

  const groupedNotifications = groupNotifications(selectedClaim.notifications);

  return (
    <Drawer
      anchor="right"
      open
      onClose={() => setSelectedClaim(null)}
      slotProps={{ paper: { sx: { width: { xs: "100%", sm: 450 } } } }}
    >
      <Box sx={{ p: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Detalle de reclamo
          </Typography>
          <IconButton onClick={() => setSelectedClaim(null)} size="small">
            <FuseSvgIcon size={18}>lucide:x</FuseSvgIcon>
          </IconButton>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {selectedClaim.claimNumber}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={1.25}>
          <DetailRow label="Cliente" value={selectedClaim.customerName} />
          <DetailRow label="Cédula" value={selectedClaim.customerId} />
          <DetailRow label="Póliza" value={selectedClaim.policyNumber} />
          <DetailRow label="Ramo" value={selectedClaim.branch} />
          <DetailRow label="Estado" value={selectedClaim.status} />
          <DetailRow label="Ocurrencia" value={selectedClaim.occurrenceDate} />
          <DetailRow label="Reporte" value={selectedClaim.reportDate} />
          <DetailRow
            label="Monto reclamo"
            value={`${selectedClaim.currency} ${selectedClaim.claimedAmount.toFixed(2)}`}
          />
          <DetailRow label="Asignado" value={selectedClaim.assignedTo} />
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Checklist
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip
            size="small"
            color={
              selectedClaim.checklist.incidentReport ? "success" : "default"
            }
            label="Informe del siniestro"
          />
          <Chip
            size="small"
            color={
              selectedClaim.checklist.insuredIdCopy ? "success" : "default"
            }
            label="Copia de cédula"
          />
          <Chip
            size="small"
            color={selectedClaim.checklist.policyCopy ? "success" : "default"}
            label="Copia de póliza"
          />
          <Chip
            size="small"
            color={selectedClaim.checklist.photos ? "success" : "default"}
            label="Fotografías"
          />
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography variant="caption" color="text.secondary">
          Descripción del reclamo
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          {selectedClaim.description}
        </Typography>
      </Box>
    </Drawer>
  );
};

export { ClaimDetailDrawer };
