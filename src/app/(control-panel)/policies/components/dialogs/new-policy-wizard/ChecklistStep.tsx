import DescriptionIcon from "@mui/icons-material/Description";
import {
  Alert,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { DocumentItem, PersonaType, Ramo } from "../../../data/dataConfig";
import { CHECKLIST_CATEGORY_OPTIONS } from "../../../constants/newPolicyWizardConfig";
import type { ChecklistEntry } from "../../../types/newPolicyWizard";

type Props = {
  personType: PersonaType | null;
  branch: Ramo | null;
  checklistItems: DocumentItem[];
  generatedDocuments: string[];
  ensureChecklistEntry: (item: DocumentItem) => ChecklistEntry;
  onChecklistChange: (key: string, patch: Partial<ChecklistEntry>) => void;
  onGenerateMockDocuments: () => void;
};

export const ChecklistStep = ({
  personType,
  branch,
  checklistItems,
  generatedDocuments,
  ensureChecklistEntry,
  onChecklistChange,
  onGenerateMockDocuments,
}: Props) => {
  if (!personType || !branch) {
    return (
      <Alert severity="info">
        Completa el paso de datos para cargar el checklist.
      </Alert>
    );
  }

  return (
    <Stack spacing={2}>
      {/* <Typography
				variant="body2"
				color="text.secondary"
			>
				Checklist basado en documentos del Excel para {branch} {personType}.
			</Typography> */}

      {checklistItems.map((item) => {
        const state = ensureChecklistEntry(item);

        return (
          <Paper
            key={item.key}
            variant="outlined"
            sx={{ p: 2, borderRadius: 3 }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 5 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={state.delivered}
                      onChange={(_, checked) =>
                        onChecklistChange(item.key, {
                          delivered: checked,
                          hasExpiration: checked ? state.hasExpiration : false,
                          expirationDate: checked ? state.expirationDate : "",
                        })
                      }
                    />
                  }
                  label={
                    <Stack spacing={0.3}>
                      <Typography fontWeight={700}>{item.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.required ? "Requerido" : "Opcional"}
                      </Typography>
                    </Stack>
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <FormControl fullWidth size="small" disabled={!state.delivered}>
                  <InputLabel>Categoria</InputLabel>
                  <Select
                    label="Categoria"
                    value={state.category}
                    onChange={(event) =>
                      onChecklistChange(item.key, {
                        category: event.target.value,
                      })
                    }
                  >
                    {CHECKLIST_CATEGORY_OPTIONS.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 1.8 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      disabled={!state.delivered}
                      checked={state.hasExpiration}
                      onChange={(_, checked) =>
                        onChecklistChange(item.key, {
                          hasExpiration: checked,
                          expirationDate: checked ? state.expirationDate : "",
                        })
                      }
                    />
                  }
                  label="Vence"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 2.2 }}>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="Fecha"
                  slotProps={{ inputLabel: { shrink: true } }}
                  disabled={!state.delivered || !state.hasExpiration}
                  value={state.expirationDate}
                  onChange={(event) =>
                    onChecklistChange(item.key, {
                      expirationDate: event.target.value,
                    })
                  }
                />
              </Grid>
            </Grid>
          </Paper>
        );
      })}

      <Divider />

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1.5}
        alignItems={{ xs: "stretch", md: "center" }}
      >
        <Button
          variant="outlined"
          startIcon={<DescriptionIcon />}
          onClick={onGenerateMockDocuments}
        >
          Generar documento mock
        </Button>
        <Typography variant="body2" color="text.secondary">
          Crea nombres mock usando documentos marcados como entregados.
        </Typography>
      </Stack>

      {generatedDocuments.length > 0 ? (
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Documento mock generado
          </Typography>
          <Stack spacing={0.7}>
            {generatedDocuments.map((fileName) => (
              <Typography key={fileName} variant="body2">
                - {fileName}
              </Typography>
            ))}
          </Stack>
        </Paper>
      ) : null}
    </Stack>
  );
};
