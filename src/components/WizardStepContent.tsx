
import React from "react";
import WizardStep1Describe from "./WizardStep1Describe";
import WizardStep2Roles from "./WizardStep2Roles";
import { WizardBudgetStep } from "./WizardBudgetStep";
import { WizardStepTokenConfirm } from "./WizardStepTokenConfirm";
import { AdvancedTokenCustomizationWrapper } from "./AdvancedTokenCustomizationWrapper";
import { WizardStep4Success } from "./WizardStep4Success";
import { SkippingStepLoader } from "./SkippingStepLoader";
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

export const WizardStepContent: React.FC<WizardStepContentProps> = ({
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
}) => {
  console.log("[WizardStepContent] Current step:", state.step, "doAdvancedToken:", state.doAdvancedToken);

  switch (state.step) {
    case 1:
      return (
        <WizardStep1Describe
          projectIdea={state.projectIdea}
          projectType={state.projectType}
          mode={state.mode}
          walletAddress={walletAddress}
          onSetField={setField}
          onSetMode={setMode}
          onLoadDefaultRoles={loadDefaultRoles}
          canProceed={state.projectIdea && !!state.projectIdea.trim()}
          onNext={() => setStep(2)}
        />
      );
    case 2:
      return (
        <div className="h-full max-h-[calc(90vh-152px)] flex flex-col">
          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4" style={{ scrollbarGutter: "stable" }}>
            <WizardStep2Roles
              roles={state.roles}
              editingRoleIdx={state.editingRoleIdx}
              projectType={state.projectType}
              mode={state.mode}
              setField={setField}
              loadDefaultRoles={loadDefaultRoles}
              saveRole={saveRole}
              removeRole={removeRole}
              setStep={setStep}
            />
          </div>
        </div>
      );
    case 3:
      return (
        <WizardBudgetStep
          state={state}
          onUpdateRolePercent={updateRolePercent}
          onSaveExpense={saveExpense}
          onRemoveExpense={removeExpense}
          onSetField={setField}
          onNext={() => setStep(4)}
          onBack={() => setStep(2)}
        />
      );
    case 4:
      return (
        <WizardStepTokenConfirm
          doAdvancedToken={!!state.doAdvancedToken}
          setDoAdvancedToken={setDoAdvancedToken}
          onNext={() => {
            console.log("[WizardStepContent] Step 4 onNext, doAdvancedToken:", state.doAdvancedToken);
            if (state.doAdvancedToken) {
              setStep(5);
            } else {
              setStep(lastStep);
            }
          }}
          onBack={() => setStep(3)}
        />
      );
    case 5:
      if (state.doAdvancedToken) {
        return (
          <div className="overflow-y-auto px-6 py-4 h-full">
            <AdvancedTokenCustomizationWrapper
              state={state}
              setTokenCustomization={setTokenCustomization}
              setStep={setStep}
              onBack={() => setStep(4)}
              onNext={() => setStep(lastStep)}
            />
          </div>
        );
      } else {
        // Show loading if somehow we end up here without advanced token selected
        return <SkippingStepLoader />;
      }
    case lastStep:
      return (
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
      );
    default:
      console.warn("[WizardStepContent] Unknown step:", state.step);
      return null;
  }
};
