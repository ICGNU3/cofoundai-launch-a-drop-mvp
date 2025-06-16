
import React from "react";
import { WizardStepContent } from "../WizardStepContent";
import { SkippingStepLoader } from "../SkippingStepLoader";
import type { WizardStateData } from "@/hooks/useWizardState";

interface WizardStepRendererProps {
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

export const WizardStepRenderer: React.FC<WizardStepRendererProps> = (props) => {
  const { state, wantsAdvanced, lastStep } = props;

  // Show skipping loader if auto-skipping to a future step (step 6)
  if (
    state.step === 5 &&
    !state.doAdvancedToken &&
    lastStep > 5
  ) {
    console.log("[WizardStepRenderer] Showing SkippingStepLoader (skipping to next step)...");
    return <SkippingStepLoader />;
  }

  // If on step 5, advanced not wanted, and this is the last step (no more steps) -- show final step content
  if (
    state.step === 5 &&
    !state.doAdvancedToken &&
    lastStep === 5
  ) {
    console.log("[WizardStepRenderer] At step 5, NOT advanced, but lastStep = 5 (showing success content)");
  }

  return (
    <WizardStepContent
      state={state}
      setStep={props.setStep}
      setField={props.setField}
      setMode={props.setMode}
      saveRole={props.saveRole}
      removeRole={props.removeRole}
      updateRolePercent={props.updateRolePercent}
      saveExpense={props.saveExpense}
      removeExpense={props.removeExpense}
      loadDefaultRoles={props.loadDefaultRoles}
      setTokenCustomization={props.setTokenCustomization}
      setDoAdvancedToken={props.setDoAdvancedToken}
      handleRestart={props.handleRestart}
      walletAddress={props.walletAddress}
      wantsAdvanced={wantsAdvanced}
      lastStep={lastStep}
    />
  );
};
