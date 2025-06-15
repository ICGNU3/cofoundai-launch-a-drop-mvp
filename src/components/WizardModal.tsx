import React from "react";
import { X } from "lucide-react";
import { WizardStep1Describe } from "./WizardStep1Describe";
import WizardStep2Roles from "./WizardStep2Roles";
import { WizardBudgetStep } from "./WizardBudgetStep";
import { WizardStep4Success } from "./WizardStep4Success";
import { useWizardState } from "@/hooks/useWizardState";
import { WizardStepTokenConfirm } from "./WizardStepTokenConfirm";
import { AdvancedTokenCustomizationWrapper } from "./AdvancedTokenCustomizationWrapper";
import { WizardHeader } from "./WizardHeader";
import { WizardProgressBar } from "./WizardProgressBar";
import { WizardStepContent } from "./WizardStepContent";
import { SkippingStepLoader } from "./SkippingStepLoader";

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
    saveRole,
    removeRole,
    updateRolePercent,
    saveExpense,
    removeExpense,
    loadDefaultRoles,
    setTokenCustomization,
    setDoAdvancedToken,
  } = useWizardState();

  if (!isOpen) return null;

  const wantsAdvanced = !!state.doAdvancedToken;
  const totalSteps = wantsAdvanced ? 6 : 5;
  const lastStep = totalSteps;
  const progressStep = Math.max(1, Math.min(state.step, totalSteps));

  // -------------------------------------------------------------------
  // !!! CRITICAL: SKIP STEP 5 OUTSIDE OF RENDER !!!
  // If user is on step 5 but didn't select advanced, immediately redirect to step 6 BEFORE rendering.
  // -------------------------------------------------------------------
  if (state.step === 5 && !state.doAdvancedToken) {
    setStep(6);
    return null;
  }

  const handleRestart = () => {
    setStep(1);
    setField("projectIdea", "");
    setField("projectType", "Music");
    setField("roles", []);
    setField("expenses", []);
    setField("pledgeUSDC", "");
    setDoAdvancedToken(false);
    setTokenCustomization(undefined);
  };

  const getStepTitle = () => {
    if (state.step === 1) return "Describe Your Project";
    if (state.step === 2) return "Define Roles & Revenue Split";
    if (state.step === 3) return "Budget Breakdown";
    if (state.step === 4) return "Token Customization";
    if (wantsAdvanced && state.step === 5) return "Advanced Token Customization";
    if (state.step === lastStep) return "Launch Your Drop";
    return "Create Your Drop";
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
        <WizardHeader 
          title={getStepTitle()} 
          currentStep={progressStep} 
          totalSteps={totalSteps} 
          onClose={onClose} 
        />
        <WizardProgressBar 
          totalSteps={totalSteps} 
          progressStep={progressStep}
        />
        <div className="flex-1 overflow-hidden">
          <WizardStepContent
            state={state}
            setStep={setStep}
            setField={setField}
            saveRole={saveRole}
            removeRole={removeRole}
            updateRolePercent={updateRolePercent}
            saveExpense={saveExpense}
            removeExpense={removeExpense}
            loadDefaultRoles={loadDefaultRoles}
            setTokenCustomization={setTokenCustomization}
            setDoAdvancedToken={setDoAdvancedToken}
            handleRestart={handleRestart}
            walletAddress={walletAddress}
            wantsAdvanced={wantsAdvanced}
            lastStep={lastStep}
          />
        </div>
      </div>
    </div>
  );
};
