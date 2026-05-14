import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type {
  CollectionCaseView,
  CollectionContactChannel,
  CollectionFollowUpOutcome,
} from "../../types/types";

type CollectionCaseDrawerProps = {
  selectedCase: CollectionCaseView | null;
  onClose: () => void;
  onRecordFollowUp: (payload: {
    caseId: string;
    channel: CollectionContactChannel;
    outcome: CollectionFollowUpOutcome;
    note: string;
    nextActionDate: string;
  }) => void;
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <Box sx={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: 1 }}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2">{value}</Typography>
  </Box>
);

const toneColorMap = {
  info: "info.main",
  warning: "warning.main",
  success: "success.main",
  error: "error.main",
} as const;

export const CollectionCaseDrawer = (props: Readonly<CollectionCaseDrawerProps>) => {
  const { selectedCase, onClose, onRecordFollowUp } = props;
  const [channel, setChannel] = useState<CollectionContactChannel>("call");
  const [outcome, setOutcome] = useState<CollectionFollowUpOutcome>("contacted");
  const [note, setNote] = useState("");
  const [nextActionDate, setNextActionDate] = useState("2026-05-15");

  useEffect(() => {
    setChannel("call");
    setOutcome("contacted");
    setNote("");
    setNextActionDate("2026-05-15");
  }, [selectedCase?.id]);

  if (!selectedCase) {
    return (
      <Drawer
        anchor="right"
        open={false}
        onClose={onClose}
        slotProps={{ paper: { sx: { width: { xs: "100%", sm: 470 } } } }}
      />
    );
  }

  return (
    <Drawer
      anchor="right"
      open
      onClose={onClose}
      slotProps={{ paper: { sx: { width: { xs: "100%", sm: 470 } } } }}
    >
      <Box sx={{ p: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Caso de cobranza
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedCase.customerName}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1.5 }}>
          <Chip size="small" color="warning" label={`Sync: ${selectedCase.syncState}`} />
          <Chip size="small" color="info" variant="outlined" label={selectedCase.operationalStage} />
          <Chip size="small" color="error" variant="outlined" label={`${selectedCase.overdueDays} días`} />
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={1.1}>
          <DetailRow label="Cédula / RUC" value={selectedCase.customerId} />
          <DetailRow label="Póliza" value={selectedCase.policyNumber} />
          <DetailRow label="Cuota" value={selectedCase.installmentCode} />
          <DetailRow label="Saldo" value={`${selectedCase.currency} ${selectedCase.amountDue.toFixed(2)}`} />
          <DetailRow label="Vencimiento" value={selectedCase.dueDate} />
          <DetailRow label="Aseguradora" value={selectedCase.insuranceCompany} />
          <DetailRow label="Gestor" value={selectedCase.assignedTo} />
          <DetailRow label="Teléfono" value={selectedCase.phone} />
          <DetailRow label="Correo" value={selectedCase.email} />
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Timeline
        </Typography>
        <Stack spacing={1.2}>
          {selectedCase.timeline.map((item) => (
            <Paper key={item.id} variant="outlined" sx={{ p: 1.4, borderLeft: 3, borderColor: toneColorMap[item.tone] }}>
              <Typography variant="caption" color="text.secondary">
                {item.date}
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.description}
              </Typography>
            </Paper>
          ))}
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Seguimiento de llamadas y observaciones
        </Typography>
        {selectedCase.followUps.length === 0 ? (
          <Alert severity="info" sx={{ mb: 1.5 }}>
            Este caso aún no tiene gestiones registradas.
          </Alert>
        ) : (
          <Stack spacing={1.1} sx={{ mb: 1.5 }}>
            {selectedCase.followUps.map((item) => (
              <Paper key={item.id} variant="outlined" sx={{ p: 1.3 }}>
                <Typography variant="caption" color="text.secondary">
                  {item.date} · {item.agent} · {item.channel}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {item.outcome}
                </Typography>
                <Typography variant="body2">{item.note}</Typography>
              </Paper>
            ))}
          </Stack>
        )}

        <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2, bgcolor: "background.default" }}>
          <Stack spacing={1.2}>
            <Typography variant="subtitle2">Registrar nueva gestión</Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
              <TextField
                select
                fullWidth
                label="Canal"
                value={channel}
                onChange={(event) => setChannel(event.target.value as CollectionContactChannel)}
              >
                <MenuItem value="call">Llamada</MenuItem>
                <MenuItem value="whatsapp">WhatsApp</MenuItem>
                <MenuItem value="email">Correo</MenuItem>
              </TextField>
              <TextField
                select
                fullWidth
                label="Resultado"
                value={outcome}
                onChange={(event) => setOutcome(event.target.value as CollectionFollowUpOutcome)}
              >
                <MenuItem value="contacted">Contactado</MenuItem>
                <MenuItem value="promise_to_pay">Promesa de pago</MenuItem>
                <MenuItem value="no_answer">No responde</MenuItem>
                <MenuItem value="escalated">Escalado</MenuItem>
              </TextField>
            </Stack>
            <TextField
              label="Próxima acción"
              type="date"
              value={nextActionDate}
              onChange={(event) => setNextActionDate(event.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="Observación"
              multiline
              minRows={3}
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                onRecordFollowUp({
                  caseId: selectedCase.id,
                  channel,
                  outcome,
                  note,
                  nextActionDate,
                });
              }}
            >
              Guardar gestión
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Drawer>
  );
};
