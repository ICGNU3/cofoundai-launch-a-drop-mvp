
import React from "react";
import { X } from "lucide-react";
import { WizardStep1Describe } from "./WizardStep1Describe";
import WizardStep2Roles from "./WizardStep2Roles";
import { WizardBudgetStep } from "./WizardBudgetStep";
import { WizardStep4Success } from "./WizardStep4Success";
import { useWizardState } from "@/hooks/useWizardState";
import { WizardStepTokenConfirm } from "./WizardStepTokenConfirm";
import { AdvancedTokenCustomizationWrapper } from "./AdvancedTokenCustomizationWrapper";

// Spinner loader for seamless skip
function SkippingStepLoader() {
  React.useEffect(() => {
    // This will be called every render, which is fine as step will change and re-render
  }, []);
  return (
    <div className="flex items-center justify-center h-full py-12">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent mb-4"></div>
        <p className="text-lg text-muted-foreground">Skipping step…</p>
      </div>
    </div>
  );
}

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

  // Correction: Always render *something* at step 5—even if non-advanced—so hook order is *not* broken

  // If user is at step 5 but didn't select advanced, auto-advance to launch with a safe effect.
  React.useEffect(() => {
    if (!state.doAdvancedToken && state.step === 5) {
      // Slight delay to ensure react does not skip a render pass,
      // but safe to call immediately as it just changes state.
      setTimeout(() => setStep(6), 0);
    }
  }, [state.doAdvancedToken, state.step, setStep]);

  const handleNext = () => {
    if (state.step === 4) {
      if (state.doAdvancedToken) setStep(5);
      else setStep(6);
    } else if (state.step === 5 && !state.doAdvancedToken) {
      setStep(6); // Should never hit now, but just in case.
    } else if (state.step < lastStep) {
      setStep((state.step + 1) as any);
    }
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

          {/* Advanced config - only if chosen; always render something at step 5 */}
          {state.step === 5 && (
            state.doAdvancedToken ? (
              <div className="overflow-y-auto px-6 py-4 h-full">
                <AdvancedTokenCustomizationWrapper
                  state={state}
                  setTokenCustomization={setTokenCustomization}
                  setStep={setStep}
                  onBack={handleBack}
                  onNext={() => setStep(6)}
                />
              </div>
            ) : (
              <SkippingStepLoader />
            )
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

