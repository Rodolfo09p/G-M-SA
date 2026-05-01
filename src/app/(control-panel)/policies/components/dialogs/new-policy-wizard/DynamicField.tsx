import React, { useMemo } from "react";
import {
  Autocomplete,
  TextField,
} from "@mui/material";
import type { FormField } from "../../../types/newPolicyWizard";

type Props = {
  field: FormField;
  value: string;
  onChange: (next: string) => void;
  optionsOverride?: string[];
};

export const DynamicField = React.memo(
  ({ field, value, onChange, optionsOverride }: Props) => {
    const options = useMemo(
      () => optionsOverride ?? field.options ?? [],
      [optionsOverride, field.options],
    );

    const resolvedOptions = useMemo(() => {
      if (!value || options.includes(value)) {
        return options;
      }

      return [value, ...options];
    }, [options, value]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    };

    const handleSelectChange = (
      _event: React.SyntheticEvent,
      nextValue: string | null,
    ) => {
      onChange(nextValue ?? "");
    };

    if (field.kind === "select") {
      return (
        <Autocomplete
          options={resolvedOptions}
          value={value || null}
          onChange={handleSelectChange}
          disablePortal
          openOnFocus
          autoHighlight
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              size="medium"
              label={field.label}
              required={field.required}
            />
          )}
        />
      );
    }

    let inputType: "text" | "date" | "number" = "text";

    if (field.kind === "date") inputType = "date";
    if (field.kind === "number") inputType = "number";

    return (
      <TextField
        fullWidth
        size="medium"
        label={field.label}
        required={field.required}
        type={inputType}
        value={value}
        onChange={handleChange}
        slotProps={{
          inputLabel: field.kind === "date" ? { shrink: true } : undefined,
        }}
      />
    );
  },
);
