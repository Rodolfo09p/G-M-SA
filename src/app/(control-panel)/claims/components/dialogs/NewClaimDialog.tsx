import CloseIcon from "@mui/icons-material/Close";
import DescriptionIcon from "@mui/icons-material/Description";
import SearchIcon from "@mui/icons-material/Search";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useNewClaimWizard } from "../../hooks/useNewClaimWizard";
import type { NewClaimPayload } from "../../types/types";

type NewClaimDialogProps = {
  open: boolean;
  onClose: () => void;
  onSave: (payload: NewClaimPayload) => Promise<void>;
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <Box sx={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 1, alignItems: "center" }}>
    <Typography variant="caption" color="text.secondary">{label}</Typography>
    <Typography variant="body2" fontWeight={500}>{value}</Typography>
  </Box>
);

const NewClaimDialog = (props: NewClaimDialogProps) => {
  const { open, onClose, onSave } = props;

  const {
    activeStep,
    policyQuery,
    policyPreview,
    policyNotFound,
    isSearching,
    isSaving,
    stepError,
    stepLabel,
    progressValue,
    checklistItems,
    checklistState,
    generatedDocuments,
    occurrenceDate,
    claimedAmount,
    description,
    currentStepDescription,
    isSummaryStep,
    setPolicyQuery,
    setOccurrenceDate,
    setClaimedAmount,
    setDescription,
    handleSearchPolicy,
    handleChecklistChange,
    handleGenerateMockDocuments,
    handleNext,
    handleBack,
    handleClose,
    handleSave,
  } = useNewClaimWizard({ onClose, onSave });

  const triggerSearch = () => {
    handleSearchPolicy().catch(() => undefined);
  };

  const triggerSave = () => {
    handleSave().catch(() => undefined);
  };

  const renderStep = () => {
    /* ── Step 0: Buscar póliza ── */
    if (activeStep === 0) {
      return (
        <Stack spacing={2}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
            <TextField
              fullWidth
              label="Número de póliza"
              placeholder="Ej: AU-2404-3043"
              value={policyQuery}
              onChange={(event) => setPolicyQuery(event.target.value)}
              onKeyDown={(event) => { if (event.key === "Enter") triggerSearch(); }}
              disabled={isSearching}
              error={policyNotFound}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={triggerSearch}
              disabled={isSearching || !policyQuery.trim()}
              startIcon={isSearching ? <CircularProgress size={16} color="inherit" /> : <SearchIcon />}
              sx={{ minWidth: { sm: 160 } }}
            >
              {isSearching ? "Consultando..." : "Buscar póliza"}
            </Button>
          </Stack>

          {policyNotFound && (
            <Alert severity="error">No se encontró ninguna póliza con ese número.</Alert>
          )}

          {policyPreview && (
            <Alert severity="info">
              Póliza {policyPreview.policyNumber} encontrada — {policyPreview.customerName} ({policyPreview.customerId}) · {policyPreview.branch} · {policyPreview.assignedTo}
            </Alert>
          )}

          {policyPreview?.hasExpiredCedula && (
            <Alert severity="warning">
              <Typography variant="body2" fontWeight={600}>Cédula vencida</Typography>
              <Typography variant="body2">
                {policyPreview.expiredCedulaLabel} — venció el {policyPreview.expiredCedulaDate}.
                Se requerirá en el checklist del siguiente paso.
              </Typography>
            </Alert>
          )}
        </Stack>
      );
    }

    /* ── Step 1: Checklist de documentos ── */
    if (activeStep === 1) {
      return (
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            Marca los documentos entregados para este reclamo.
          </Typography>

          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell width="12%">Req.</TableCell>
                  <TableCell>Documento</TableCell>
                  <TableCell width="18%">Entregado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {checklistItems.map((item) => (
                  <TableRow key={item.key} hover>
                    <TableCell>
                      <Checkbox checked={item.required} disabled size="small" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={item.required ? 600 : 400}>
                        {item.label}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={checklistState[item.key] ?? false}
                        onChange={(_, checked) => handleChecklistChange(item.key, checked)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Divider />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ sm: "center" }}>
            <Button
              variant="outlined"
              startIcon={<DescriptionIcon />}
              onClick={handleGenerateMockDocuments}
            >
              Generar documento mock
            </Button>
            <Typography variant="body2" color="text.secondary">
              Crea nombres mock de los documentos marcados como entregados.
            </Typography>
          </Stack>

          {generatedDocuments.length > 0 && (
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Documentos mock generados
              </Typography>
              <Stack spacing={0.5}>
                {generatedDocuments.map((fileName) => (
                  <Typography key={fileName} variant="body2">- {fileName}</Typography>
                ))}
              </Stack>
            </Paper>
          )}
        </Stack>
      );
    }

    /* ── Step 2: Datos del siniestro ── */
    return (
      <Stack spacing={2}>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
          <TextField
            label="Fecha de ocurrencia"
            type="date"
            value={occurrenceDate}
            onChange={(event) => setOccurrenceDate(event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            label="Monto reclamado (USD)"
            type="number"
            value={claimedAmount === 0 ? "" : claimedAmount}
            onChange={(event) => setClaimedAmount(Number(event.target.value))}
          />
        </Box>

        <TextField
          label="Descripción del siniestro"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          multiline
          minRows={3}
          placeholder="Describe brevemente cómo ocurrió el siniestro..."
        />

        {policyPreview && (
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
              Resumen del reclamo
            </Typography>
            <Stack spacing={0.8}>
              <InfoRow label="Póliza" value={policyPreview.policyNumber} />
              <InfoRow label="Cliente" value={policyPreview.customerName} />
              <InfoRow label="Ramo" value={policyPreview.branch} />
              <InfoRow
                label="Docs entregados"
                value={`${Object.values(checklistState).filter(Boolean).length} / ${checklistItems.length}`}
              />
            </Stack>
          </Paper>
        )}
      </Stack>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={isSaving || isSearching}
    >
      <DialogTitle sx={{ pr: 6 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h5" fontWeight={800}>
            Nuevo Reclamo
          </Typography>
          <Chip size="small" color="secondary" label={stepLabel} />
        </Stack>
        <IconButton
          onClick={handleClose}
          disabled={isSaving || isSearching}
          sx={{ position: "absolute", right: 12, top: 12 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        <Stack spacing={2.2}>
          <Box>
            <LinearProgress
              variant="determinate"
              value={progressValue}
              sx={{
                height: 9,
                borderRadius: 99,
                backgroundColor: "grey.200",
                "& .MuiLinearProgress-bar": { backgroundColor: "success.main" },
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {currentStepDescription}
            </Typography>
          </Box>

          {stepError && <Alert severity="warning">{stepError}</Alert>}

          <Box>{renderStep()}</Box>

          <Divider />

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Button
              variant="text"
              onClick={handleBack}
              disabled={isSaving || isSearching || activeStep === 0}
            >
              Atrás
            </Button>

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleClose}
                disabled={isSaving || isSearching}
              >
                Cancelar
              </Button>
              {isSummaryStep ? (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={triggerSave}
                  disabled={isSaving || isSearching}
                >
                  Guardar
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleNext}
                  disabled={isSaving || isSearching}
                >
                  Siguiente
                </Button>
              )}
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export { NewClaimDialog };
