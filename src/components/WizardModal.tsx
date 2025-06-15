
import React, { useState } from "react";
import { X } from "lucide-react";
import { WizardStep1Describe } from "./WizardStep1Describe";
import WizardStep2Roles from "./WizardStep2Roles";
import { WizardBudgetStep } from "./WizardBudgetStep";
import { WizardStep4Success } from "./WizardStep4Success";
import { useWizardState } from "@/hooks/useWizardState";
import { WizardStepTokenConfirm } from "./WizardStepTokenConfirm";
import { AdvancedTokenCustomizationWrapper } from "./AdvancedTokenCustomizationWrapper";

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

  // If closed, render nothing.
  if (!isOpen) return null;

  // Step logic: 1 = describe, 2 = roles, 3 = budget, 4 = token confirm, 5 = advanced config, 6 = launch/success
  const wantsAdvanced = !!state.doAdvancedToken;
  const totalSteps = wantsAdvanced ? 6 : 5;
  const lastStep = totalSteps;
  const progressStep = Math.max(1, Math.min(state.step, totalSteps));

  // NEW LOGIC TO PREVENT BLANK STEP 5:
  // - If NOT advanced, step 5 instantly skips ahead to step 6. Blank page is avoided by never rendering content in such case.
  React.useEffect(() => {
    // Defensive: auto-advance if user is on step 5 but did not choose advanced
    if (!state.doAdvancedToken && state.step === 5) {
      setStep(6);
    }
  }, [state.doAdvancedToken, state.step, setStep]);

  const handleNext = () => {
    // At Token Customization decision (step 4):
    if (state.step === 4) {
      if (state.doAdvancedToken) setStep(5);
      else setStep(6);
    } else if (state.step === 5 && !state.doAdvancedToken) {
      setStep(6); // Defensive: shouldn't hit, but for safety
    } else if (state.step < lastStep) {
      setStep((state.step + 1) as any);
    }
    // else, already at or past last step.
  };

  const handleBack = () => {
    if (state.step === 4) setStep(3);
    else if (state.step === 5 && state.doAdvancedToken) setStep(4);
    else if (state.step > 1) setStep((state.step - 1) as any);
  };

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
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold text-headline">{getStepTitle()}</h2>
            <div className="text-sm text-body-text/70 mt-1">
              Step {progressStep} of {totalSteps}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-body-text/60 hover:text-body-text transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        {/* Progress Indicator */}
        <div className="px-6 py-3 border-b border-border">
          <div className="flex gap-2">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((stepNum) => (
              <div
                key={stepNum}
                className={`flex-1 h-2 rounded-full ${
                  stepNum <= progressStep
                    ? "bg-accent"
                    : stepNum === progressStep + 1
                    ? "bg-accent/30"
                    : "bg-border"
                }`}
              />
            ))}
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {state.step === 1 && (
            <WizardStep1Describe
              projectIdea={state.projectIdea}
              projectType={state.projectType}
              onSetField={setField}
              onLoadDefaultRoles={loadDefaultRoles}
              canProceed={state.projectIdea && !!state.projectIdea.trim()}
              onNext={handleNext}
            />
          )}

          {state.step === 2 && (
            <div className="h-full max-h-[calc(90vh-152px)] flex flex-col">
              <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4" style={{ scrollbarGutter: "stable" }}>
                <WizardStep2Roles
                  roles={state.roles}
                  editingRoleIdx={state.editingRoleIdx}
                  projectType={state.projectType}
                  setField={setField}
                  loadDefaultRoles={loadDefaultRoles}
                  saveRole={saveRole}
                  removeRole={removeRole}
                  setStep={setStep}
                />
              </div>
            </div>
          )}

          {state.step === 3 && (
            <WizardBudgetStep
              state={state}
              onUpdateRolePercent={updateRolePercent}
              onSaveExpense={saveExpense}
              onRemoveExpense={removeExpense}
              onSetField={setField}
              onNext={() => setStep(4)}
              onBack={handleBack}
            />
          )}

          {/* Token customization branching */}
          {state.step === 4 && (
            <WizardStepTokenConfirm
              doAdvancedToken={!!state.doAdvancedToken}
              setDoAdvancedToken={setDoAdvancedToken}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {/* Advanced config - only if chosen */}
          {state.doAdvancedToken && state.step === 5 && (
            <div className="overflow-y-auto px-6 py-4 h-full">
              <AdvancedTokenCustomizationWrapper
                state={state}
                setTokenCustomization={setTokenCustomization}
                setStep={setStep}
                onBack={handleBack}
                onNext={() => setStep(6)}
              />
            </div>
          )}

          {/* Final launch step */}
          {state.step === lastStep && (
            <WizardStep4Success
              projectIdea={state.projectIdea}
              projectType={state.projectType}
              roles={state.roles}
              expenses={state.expenses}
              pledgeUSDC={state.pledgeUSDC}
              walletAddress={walletAddress}
              tokenCustomization={state.doAdvancedToken ? state.tokenCustomization : undefined}
              onRestart={handleRestart}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// ... End of file. This WizardModal.tsx file is long. Consider breaking out additional steps or logic into their own files for even better maintainability!
