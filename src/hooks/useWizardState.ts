
import React from "react";
import { getInitialWizardState } from "./wizard/defaults";
import { useWizardActions } from "./wizard/useWizardActions";

// Re-export types for backward compatibility
export type {
  PayoutType,
  WizardStep,
  ProjectMode,
  ProjectType,
  Role,
  Expense,
  WizardStateData
} from "./wizard/types";

export function useWizardState() {
  const [state, setState] = React.useState(getInitialWizardState());
  const actions = useWizardActions(state, setState);

  return {
    state,
    setState,
    ...actions,
  };
}
