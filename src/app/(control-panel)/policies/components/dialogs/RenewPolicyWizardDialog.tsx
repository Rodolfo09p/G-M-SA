import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAppFeedback } from "@/components";
import { useRenewPolicyWizard } from "../../hooks/useRenewPolicyWizard";
import type { WizardPayload } from "../../types/newPolicyWizard";
import { ChecklistStep } from "./new-policy-wizard/ChecklistStep";
import { DataStep } from "./new-policy-wizard/DataStep";
import { SummaryStep } from "./new-policy-wizard/SummaryStep";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (payload: { sourcePolicyNumber: string; payload: WizardPayload }) => Promise<void>;
};

export const RenewPolicyWizardDialog = ({ open, onClose, onSave }: Props) => {
  const { showLoading, showAlert } = useAppFeedback();
  const {
    activeStep,
    stepError,
    stepLabel,
    progressValue,
    isSummaryStep,
    isSaving,
    isSearchingPolicy,
    policyNumberQuery,
    selectedPolicy,
    selectedCustomer,
    expiredDocuments,
    personType,
    branch,
    company,
    assignment,
    clientData,
    branchData,
    checklistItems,
    checklistState,
    generatedDocuments,
    currentClientFields,
    currentBranchFields,
    modelOptions,
    currentStepDescription,
    setPolicyNumberQuery,
    setCompany,
    setAssignment,
    handleClose,
    handleBack,
    handleNext,
    handleSave,
    handleSearchPolicy,
    handleBranchFieldChange,
    handleChecklistChange,
    handleGenerateMockDocuments,
    ensureChecklistEntry,
  } = useRenewPolicyWizard({ onClose, onSave });

  const handleDialogClose = () => {
    if (isSaving || isSearchingPolicy) {
      return;
    }

    handleClose();
  };

  const triggerSearchPolicy = () => {
    const run = async () => {
      const closeLoading = showLoading({
        title: "Consultando póliza",
        text: "Por favor, espere...",
      });

      try {
        const result = await handleSearchPolicy();

        if (result.status === "not_found") {
          await showAlert({
            icon: "info",
            title: "Póliza no encontrada",
            text: `No se encontró la póliza: ${result.query}`,
          });
        }
      } finally {
        closeLoading();
      }
    };

    run().catch(() => undefined);
  };

  const triggerSave = () => {
    handleSave().catch(() => undefined);
  };

  const renderStepContent = () => {
    if (activeStep === 0) {
      return (
        <Stack spacing={2}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
            <TextField
              fullWidth
              label="Número de póliza"
              placeholder="Ej: AU-2404-3043"
              value={policyNumberQuery}
              onChange={(event) => setPolicyNumberQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  triggerSearchPolicy();
                }
              }}
              disabled={isSaving || isSearchingPolicy}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={triggerSearchPolicy}
              disabled={isSaving || isSearchingPolicy}
              startIcon={<SearchIcon />}
              sx={{ minWidth: { sm: 170 } }}
            >
              Buscar póliza
            </Button>
          </Stack>

          {selectedPolicy ? (
            <Alert severity="info">
              Póliza encontrada: {selectedPolicy.policyNumber} - Ramo {selectedPolicy.branch}
            </Alert>
          ) : null}

          {selectedCustomer ? (
            <Alert severity="info">
              Cliente asociado: {selectedCustomer.fullName} ({selectedCustomer.id})
            </Alert>
          ) : null}

          {expiredDocuments.length > 0 ? (
            <Alert severity="warning">
              <Stack spacing={0.3}>
                <Typography fontWeight={700}>
                  Este cliente tiene documentos vencidos:
                </Typography>
                {expiredDocuments.map((document) => (
                  <Typography key={`${document.customerId}-${document.label}`} variant="body2">
                    - {document.label} (venció {document.expirationDate})
                  </Typography>
                ))}
              </Stack>
            </Alert>
          ) : null}
        </Stack>
      );
    }

    if (activeStep === 1) {
      return (
        <DataStep
          personType={personType}
          branch={branch}
          company={company}
          assignment={assignment}
          clientData={clientData}
          branchData={branchData}
          currentClientFields={currentClientFields}
          currentBranchFields={currentBranchFields}
          modelOptions={modelOptions}
          setCompany={setCompany}
          setAssignment={setAssignment}
          setBranch={() => undefined}
          onClientFieldChange={() => undefined}
          onBranchFieldChange={handleBranchFieldChange}
          showClientFields={false}
          showBranchSelector={false}
          existingCustomerSummary={
            selectedCustomer
              ? {
                  id: selectedCustomer.id,
                  fullName: selectedCustomer.fullName,
                }
              : undefined
          }
        />
      );
    }

    if (activeStep === 2) {
      return (
        <ChecklistStep
          personType={personType}
          branch={branch}
          checklistItems={checklistItems}
          generatedDocuments={generatedDocuments}
          ensureChecklistEntry={ensureChecklistEntry}
          onChecklistChange={handleChecklistChange}
          onGenerateMockDocuments={handleGenerateMockDocuments}
        />
      );
    }

    return (
      <SummaryStep
        personType={personType}
        branch={branch}
        company={company}
        assignment={assignment}
        currentClientFields={currentClientFields}
        clientData={clientData}
        currentBranchFields={currentBranchFields}
        branchData={branchData}
        checklistItems={checklistItems}
        checklistState={checklistState}
        generatedDocuments={generatedDocuments}
      />
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={isSaving || isSearchingPolicy}
    >
      <DialogTitle sx={{ pr: 6 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h5" fontWeight={800}>
            Renovar Póliza
          </Typography>
          <Chip size="small" color="secondary" label={stepLabel} />
        </Stack>
        <IconButton
          onClick={handleClose}
          disabled={isSaving || isSearchingPolicy}
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
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "success.main",
                },
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {currentStepDescription}
            </Typography>
          </Box>

          {stepError ? <Alert severity="warning">{stepError}</Alert> : null}

          <Box>{renderStepContent()}</Box>

          <Divider />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              variant="text"
              onClick={handleBack}
              disabled={isSaving || isSearchingPolicy || activeStep === 0}
            >
              Atrás
            </Button>

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleClose}
                disabled={isSaving || isSearchingPolicy}
              >
                Cancelar
              </Button>
              {isSummaryStep ? (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={triggerSave}
                  disabled={isSaving || isSearchingPolicy}
                >
                  Guardar
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleNext}
                  disabled={isSaving || isSearchingPolicy}
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
