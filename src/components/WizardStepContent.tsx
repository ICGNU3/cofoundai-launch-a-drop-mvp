
import React from "react";
import { createStepMap } from "./wizard/WizardStepMap";
import type { WizardStateData } from "@/hooks/useWizardState";

interface WizardStepContentProps {
  state: WizardStateData;
  setStep: (n: number) => void;
  setField: <K extends keyof WizardStateData>(k: K, v: WizardStateData[K]) => void;
  setMode: (mode: any, walletAddress?: string) => void;
  saveRole: (role: any, idx: number | null) => void;
  removeRole: (idx: number) => void;
  updateRolePercent: (idx: number, newPercent: number) => void;
  saveExpense: (exp: any, idx: number | null) => void;
  removeExpense: (idx: number) => void;
  loadDefaultRoles: (type: any) => void;
  setTokenCustomization: (tc: any) => void;
  setDoAdvancedToken: (v: boolean) => void;
  handleRestart: () => void;
  walletAddress: string | null;
  wantsAdvanced: boolean;
  lastStep: number;
}

export const WizardStepContent: React.FC<WizardStepContentProps> = (props) => {
  const { state } = props;
  
  console.log("[WizardStepContent] Current step:", state.step, "doAdvancedToken:", state.doAdvancedToken);

  const stepMap = createStepMap(props);
  const currentStepConfig = stepMap[state.step];

  if (!currentStepConfig) {
    console.warn("[WizardStepContent] Unknown step:", state.step);
    return null;
  }

  const { component: StepComponent, props: stepProps, requiresScrollWrapper } = currentStepConfig;
  const componentProps = stepProps();

  const stepElement = <StepComponent {...componentProps} />;

  if (requiresScrollWrapper) {
    return (
      <div className="h-full overflow-y-auto px-6 py-4">
        {stepElement}
      </div>
    );
  }

  return stepElement;
};
