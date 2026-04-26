import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import type { FormField } from "../../../types/newPolicyWizard";

type Props = {
  field: FormField;
  value: string;
  onChange: (next: string) => void;
  optionsOverride?: string[];
};

export const DynamicField = ({
  field,
  value,
  onChange,
  optionsOverride,
}: Props) => {
  const options = optionsOverride ?? field.options ?? [];

  if (field.kind === "select") {
    return (
      <FormControl fullWidth required={field.required}>
        <InputLabel>{field.label}</InputLabel>
        <Select
          label={field.label}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  let inputType: "text" | "date" | "number" = "text";

  if (field.kind === "date") {
    inputType = "date";
  }

  if (field.kind === "number") {
    inputType = "number";
  }

  return (
    <TextField
      fullWidth
      label={field.label}
      required={field.required}
      type={inputType}
      slotProps={{
        inputLabel: field.kind === "date" ? { shrink: true } : undefined,
      }}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
};
