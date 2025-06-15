import React from "react";
import { X } from "lucide-react";
import WizardStep1Describe from "./WizardStep1Describe";
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

  const wantsAdvanced = !!state.doAdvancedToken;
  const totalSteps = wantsAdvanced ? 6 : 5;
  const lastStep = totalSteps;
  const progressStep = Math.max(1, Math.min(state.step, totalSteps));

  console.log("[WizardModal] Step:", state.step, "wantsAdvanced:", wantsAdvanced, "totalSteps:", totalSteps);

  // Fixed: Auto-skip step 5 if user doesn't want advanced customization - use useRef to prevent infinite loops
  const hasSkippedStep5 = React.useRef(false);
  
  React.useEffect(() => {
    if (state.step === 5 && !state.doAdvancedToken && !hasSkippedStep5.current) {
      console.log("[WizardModal] Auto-skipping step 5, going to step", lastStep);
      hasSkippedStep5.current = true;
      setStep(lastStep);
    }
    
    // Reset the skip flag when not on step 5
    if (state.step !== 5) {
      hasSkippedStep5.current = false;
    }
  }, [state.step, state.doAdvancedToken, lastStep, setStep]);

  // Move the early return AFTER all hooks have been called
  if (!isOpen) return null;

  const handleRestart = () => {
    hasSkippedStep5.current = false; // Reset skip flag
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

  // Show skipping loader when auto-transitioning step 5
  if (state.step === 5 && !state.doAdvancedToken) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-card border border-border rounded-lg w-full max-w-4xl h-[90vh] max-h-[600px] flex flex-col mx-auto">
          <WizardHeader 
            title="Skipping Advanced Customization" 
            currentStep={progressStep} 
            totalSteps={totalSteps} 
            onClose={onClose} 
          />
          <WizardProgressBar 
            totalSteps={totalSteps} 
            progressStep={progressStep}
          />
          <div className="flex-1 overflow-hidden">
            <SkippingStepLoader />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl h-[90vh] max-h-[600px] flex flex-col mx-auto">
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
