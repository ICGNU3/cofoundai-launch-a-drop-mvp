import React from "react";
import { X } from "lucide-react";
import { WizardStep1Describe } from "./WizardStep1Describe";
import WizardStep2Roles from "./WizardStep2Roles";
import { WizardBudgetStep } from "./WizardBudgetStep";
import { WizardStep4Success } from "./WizardStep4Success";
import { useWizardState } from "@/hooks/useWizardState";

type WizardModalProps = {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string | null;
};

export const WizardModal: React.FC<WizardModalProps> = ({
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
  } = useWizardState();

  if (!isOpen) return null;

  const handleNext = () => {
    if (state.step < 4) {
      setStep((state.step + 1) as typeof state.step);
    }
  };

  const handleBack = () => {
    if (state.step > 1) {
      setStep((state.step - 1) as typeof state.step);
    }
  };

  const handleRestart = () => {
    setStep(1);
    setField("projectIdea", "");
    setField("projectType", "Music");
    setField("roles", []);
    setField("expenses", []);
    setField("pledgeUSDC", "");
  };

  const getStepTitle = () => {
    switch (state.step) {
      case 1: return "Describe Your Project";
      case 2: return "Define Roles & Revenue Split";
      case 3: return "Budget Breakdown";
      case 4: return "Launch Your Drop";
      default: return "Create Your Drop";
    }
  };

  const canProceedStep1 = state.projectIdea.trim().length > 0;
  const canProceedStep2 = state.roles.length > 0 && 
    Math.abs(state.roles.reduce((sum, r) => sum + (r.percentNum || r.percent), 0) - 100) < 0.1;
  const canProceedStep3 = canProceedStep2 && Number(state.pledgeUSDC) > 0;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold text-headline">{getStepTitle()}</h2>
            <div className="text-sm text-body-text/70 mt-1">
              Step {state.step} of 4
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
            {[1, 2, 3, 4].map((stepNum) => (
              <div
                key={stepNum}
                className={`flex-1 h-2 rounded-full ${
                  stepNum <= state.step
                    ? "bg-accent"
                    : stepNum === state.step + 1
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
              canProceed={canProceedStep1}
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
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {state.step === 4 && (
            <WizardStep4Success
              projectIdea={state.projectIdea}
              projectType={state.projectType}
              roles={state.roles}
              expenses={state.expenses}
              pledgeUSDC={state.pledgeUSDC}
              walletAddress={walletAddress}
              onRestart={handleRestart}
            />
          )}
        </div>
      </div>
    </div>
  );
};
