import { useMemo, useState } from "react";
import type { AssignmentType } from "@/app/(control-panel)/brokerage/types/brokerageTypes";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { NewClaimPayload } from "../../types/types";

type NewClaimDialogProps = {
  open: boolean;
  onClose: () => void;
  onSave: (payload: NewClaimPayload) => Promise<void>;
};

type AssignmentOption = {
  label: string;
  value: AssignmentType;
};

const assignmentOptions: AssignmentOption[] = [
  { label: "G&M", value: "gym" },
  { label: "Subagente", value: "agent" },
];

const initialState: NewClaimPayload = {
  policyNumber: "",
  customerId: "",
  customerName: "",
  branch: "",
  assignmentType: "gym",
  assignedTo: "",
  occurrenceDate: "",
  claimedAmount: 0,
  description: "",
};

const NewClaimDialog = (props: NewClaimDialogProps) => {
  const { open, onClose, onSave } = props;
  const [form, setForm] = useState<NewClaimPayload>(initialState);
  const [isSaving, setIsSaving] = useState(false);

  const selectedAssignment = useMemo(
    () => assignmentOptions.find((option) => option.value === form.assignmentType) ?? assignmentOptions[0],
    [form.assignmentType],
  );

  const isValid =
    form.policyNumber.trim().length > 0 &&
    form.customerId.trim().length > 0 &&
    form.customerName.trim().length > 0 &&
    form.branch.trim().length > 0 &&
    form.assignedTo.trim().length > 0 &&
    form.occurrenceDate.trim().length > 0 &&
    form.claimedAmount > 0;

  const handleClose = () => {
    if (isSaving) {
      return;
    }

    onClose();
    setForm(initialState);
  };

  const handleSave = async () => {
    if (!isValid || isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      await onSave(form);
      setForm(initialState);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Nuevo reclamo</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 0.5 }}>
          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
            <TextField
              label="No. de póliza"
              value={form.policyNumber}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, policyNumber: event.target.value }))
              }
            />
            <TextField
              label="Fecha de ocurrencia"
              type="date"
              value={form.occurrenceDate}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, occurrenceDate: event.target.value }))
              }
            />
          </Box>

          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
            <TextField
              label="Cédula/RUC"
              value={form.customerId}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, customerId: event.target.value }))
              }
            />
            <TextField
              label="Cliente"
              value={form.customerName}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, customerName: event.target.value }))
              }
            />
          </Box>

          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
            <TextField
              label="Ramo"
              value={form.branch}
              onChange={(event) => setForm((prev) => ({ ...prev, branch: event.target.value }))}
            />
            <TextField
              label="Monto reclamado (USD)"
              type="number"
              value={form.claimedAmount === 0 ? "" : form.claimedAmount}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  claimedAmount: Number(event.target.value),
                }))
              }
            />
          </Box>

          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
            <Autocomplete
              options={assignmentOptions}
              getOptionLabel={(option) => option.label}
              value={selectedAssignment}
              onChange={(_event, option) =>
                setForm((prev) => ({
                  ...prev,
                  assignmentType: option?.value ?? "gym",
                }))
              }
              disableClearable
              renderInput={(params) => <TextField {...params} label="Asignación" />}
            />
            <TextField
              label="Asignado a"
              value={form.assignedTo}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, assignedTo: event.target.value }))
              }
            />
          </Box>

          <TextField
            label="Descripción"
            value={form.description}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, description: event.target.value }))
            }
            multiline
            minRows={3}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isSaving}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={!isValid || isSaving}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export { NewClaimDialog };