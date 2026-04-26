import {
  Alert,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import {
  assignmentOptions,
  companyOptions,
  type PersonaType,
  type Ramo,
} from "../../../data/dataConfig";
import { BRANCH_CARDS } from "../../../constants/newPolicyWizardConfig";
import type { FormField } from "../../../types/newPolicyWizard";
import { DynamicField } from "./DynamicField";

type Props = {
  personType: PersonaType | null;
  branch: Ramo | null;
  company: string;
  assignment: string;
  clientData: Record<string, string>;
  branchData: Record<string, string>;
  currentClientFields: FormField[];
  currentBranchFields: FormField[];
  modelOptions: string[];
  setCompany: (value: string) => void;
  setAssignment: (value: string) => void;
  setBranch: (value: Ramo) => void;
  onClientFieldChange: (key: string, value: string) => void;
  onBranchFieldChange: (key: string, value: string) => void;
};

export const DataStep = ({
  personType,
  branch,
  company,
  assignment,
  clientData,
  branchData,
  currentClientFields,
  currentBranchFields,
  modelOptions,
  setCompany,
  setAssignment,
  setBranch,
  onClientFieldChange,
  onBranchFieldChange,
}: Props) => {
  if (!personType) {
    return (
      <Alert severity="info">Primero selecciona el tipo de persona.</Alert>
    );
  }

  return (
    <Stack spacing={2.5}>
      <Paper variant="outlined" sx={{ p: 2.2, borderRadius: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth required>
              <InputLabel>Compania</InputLabel>
              <Select
                label="Compania"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
              >
                {companyOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth required>
              <InputLabel>Asignacion</InputLabel>
              <Select
                label="Asignacion"
                value={assignment}
                onChange={(event) => setAssignment(event.target.value)}
              >
                {assignmentOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="subtitle2" color="text.secondary">
        Selecciona el ramo
      </Typography>
      <Grid container spacing={2}>
        {BRANCH_CARDS.map((option) => {
          const selected = branch === option.value;

          return (
            <Grid size={{ xs: 12, md: 6 }} key={option.value}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  borderColor: selected ? "secondary.main" : "divider",
                  boxShadow: selected ? 3 : 0,
                }}
              >
                <CardActionArea onClick={() => setBranch(option.value)}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={700}>
                      {option.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {option.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Divider />

      <Typography variant="subtitle2" color="text.secondary">
        Datos del cliente
      </Typography>
      <Grid container spacing={2}>
        {currentClientFields.map((field) => (
          <Grid size={{ xs: 12, md: 6 }} key={field.key}>
            <DynamicField
              field={field}
              value={clientData[field.key] ?? ""}
              onChange={(next) => onClientFieldChange(field.key, next)}
            />
          </Grid>
        ))}
      </Grid>

      {branch ? (
        <>
          <Divider />
          <Typography variant="subtitle2" color="text.secondary">
            Datos del ramo
          </Typography>
          <Grid container spacing={2}>
            {currentBranchFields.map((field) => {
              const optionsOverride =
                field.key === "vehicleModel" ? modelOptions : undefined;

              return (
                <Grid size={{ xs: 12, md: 6 }} key={field.key}>
                  <DynamicField
                    field={field}
                    value={branchData[field.key] ?? ""}
                    onChange={(next) => onBranchFieldChange(field.key, next)}
                    optionsOverride={optionsOverride}
                  />
                </Grid>
              );
            })}
          </Grid>
        </>
      ) : null}
    </Stack>
  );
};
