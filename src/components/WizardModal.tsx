
import React from "react";
import { useWizardState } from "@/hooks/useWizardState";
import { useWizardSkipLogic } from "@/hooks/wizard/useWizardSkipLogic";
import { useWizardStepTitles } from "@/hooks/wizard/useWizardStepTitles";
import { WizardContainer } from "./wizard/WizardContainer";
import { WizardStepRenderer } from "./wizard/WizardStepRenderer";

export const WizardModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string | null;
}> = ({
  isOpen,
  onClose,
  walletAddress,
}) => {
  const {
    state,
    setStep,
    setField,
    setMode,
    saveRole,
    removeRole,
    updateRolePercent,
    saveExpense,
    removeExpense,
    loadDefaultRoles,
    setTokenCustomization,
    setDoAdvancedToken,
  } = useWizardState();

  const wantsAdvanced = !!state.doAdvancedToken;
  const totalSteps = wantsAdvanced ? 6 : 5;
  const lastStep = totalSteps;
  const progressStep = Math.max(1, Math.min(state.step, totalSteps));

  console.log("[WizardModal]---", {
    step: state.step,
    doAdvancedToken: state.doAdvancedToken,
    wantsAdvanced,
    totalSteps,
    lastStep,
    progressStep
  });

  const { resetSkipFlag } = useWizardSkipLogic({
    step: state.step,
    doAdvancedToken: !!state.doAdvancedToken,
    lastStep,
    setStep,
  });

  const { getStepTitle } = useWizardStepTitles(state.step, wantsAdvanced, lastStep);

  if (!isOpen) return null;

  const handleRestart = () => {
    resetSkipFlag();
    setStep(1);
    setField("projectIdea", "");
    setField("projectType", "Music");
    setField("mode", "team");
    setField("roles", []);
    setField("expenses", []);
    setField("pledgeUSDC", "");
    setDoAdvancedToken(false);
    setTokenCustomization(undefined);
  };

  const stepRendererProps = {
    state,
    setStep,
    setField,
    setMode,
    saveRole,
    removeRole,
    updateRolePercent,
    saveExpense,
    removeExpense,
    loadDefaultRoles,
    setTokenCustomization,
    setDoAdvancedToken,
    handleRestart,
    walletAddress,
    wantsAdvanced,
    lastStep,
  };

  return (
    <WizardContainer
      title={getStepTitle()}
      currentStep={progressStep}
      totalSteps={totalSteps}
      onClose={onClose}
    >
      <WizardStepRenderer {...stepRendererProps} />
    </WizardContainer>
  );
};
