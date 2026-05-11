import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
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
import { useAddPolicyToExistingCustomerWizard } from "../../hooks/useAddPolicyToExistingCustomerWizard";
import type { WizardPayload } from "../../types/newPolicyWizard";
import { useAppFeedback } from "@/components";
import { ChecklistStep } from "./new-policy-wizard/ChecklistStep";
import { DataStep } from "./new-policy-wizard/DataStep";
import { SummaryStep } from "./new-policy-wizard/SummaryStep";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (payload: WizardPayload) => Promise<void>;
};

export const AddPolicyToExistingCustomerWizardDialog = ({
  open,
  onClose,
  onSave,
}: Props) => {
  const { showLoading, showAlert } = useAppFeedback();

  const {
    activeStep,
    stepError,
    stepLabel,
    progressValue,
    isSummaryStep,
    isSaving,
    isSearchingCustomer,
    identificationQuery,
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
    setIdentificationQuery,
    setCompany,
    setAssignment,
    setBranch,
    handleClose,
    handleBack,
    handleNext,
    handleSave,
    handleSearchCustomer,
    handleBranchFieldChange,
    handleChecklistChange,
    handleGenerateMockDocuments,
    ensureChecklistEntry,
  } = useAddPolicyToExistingCustomerWizard({ onClose, onSave });

  const handleDialogClose = () => {
    if (isSaving || isSearchingCustomer) {
      return;
    }

    handleClose();
  };

  const triggerSearchCustomer = () => {
    const run = async () => {
      const closeLoading = showLoading({
        title: "Consultando cliente",
        text: "Por favor, espere...",
      });

      try {
        const searchResult = await handleSearchCustomer();

        if (searchResult.status === "not_found") {
          await showAlert({
            icon: "info",
            title: "Cliente no encontrado",
            text: `No se encontró un cliente con la identificación: ${searchResult.query}`,
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
              label="Número de identificación"
              placeholder="Ej: 086-210760-0001M"
              value={identificationQuery}
              onChange={(event) => setIdentificationQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  triggerSearchCustomer();
                }
              }}
              disabled={isSearchingCustomer || isSaving}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={triggerSearchCustomer}
              disabled={isSearchingCustomer || isSaving}
              startIcon={<SearchIcon />}
              sx={{ minWidth: { sm: 170 } }}
            >
              {isSearchingCustomer ? "Consultando..." : "Buscar cliente"}
            </Button>
          </Stack>

          {selectedCustomer ? (
            <Alert severity="info">
              Cliente encontrado: {selectedCustomer.fullName} ({selectedCustomer.id})
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
          setBranch={setBranch}
          onClientFieldChange={() => undefined}
          onBranchFieldChange={handleBranchFieldChange}
          showClientFields={false}
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
      disableEscapeKeyDown={isSaving || isSearchingCustomer}
    >
      <DialogTitle sx={{ pr: 6 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h5" fontWeight={800}>
            Agregar Póliza a Cliente
          </Typography>
          <Chip size="small" color="secondary" label={stepLabel} />
        </Stack>
        <IconButton
          onClick={handleClose}
          disabled={isSaving || isSearchingCustomer}
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
              disabled={isSaving || isSearchingCustomer || activeStep === 0}
            >
              Atrás
            </Button>

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleClose}
                disabled={isSaving || isSearchingCustomer}
              >
                Cancelar
              </Button>
              {isSummaryStep ? (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={triggerSave}
                  disabled={isSaving || isSearchingCustomer}
                >
                  Guardar
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleNext}
                  disabled={isSaving || isSearchingCustomer}
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
