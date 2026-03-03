import React from "react";
import { Box } from "@mui/material";
import StepRow from "./StepRow";

/**
 * StepsList - Light list of steps (no heavy box, subtle separators)
 */
export default function StepsList({ steps = [] }) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
      {steps.map((step) => (
        <StepRow
          key={step.id}
          id={step.id}
          label={step.label}
          status={step.status}
          meta={step.meta}
        />
      ))}
    </Box>
  );
}
