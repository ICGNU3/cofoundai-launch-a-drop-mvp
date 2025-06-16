
import React from "react";
import WizardStep1Describe from "../WizardStep1Describe";
import WizardStep2Roles from "../WizardStep2Roles";
import { WizardBudgetStep } from "../WizardBudgetStep";
import { WizardStepTokenConfirm } from "../WizardStepTokenConfirm";
import { AdvancedTokenCustomizationWrapper } from "../AdvancedTokenCustomizationWrapper";
import { WizardStep4Success } from "../WizardStep4Success";
import { SkippingStepLoader } from "../SkippingStepLoader";
import type { WizardStateData } from "@/hooks/useWizardState";

interface WizardStepProps {
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

interface StepComponent {
  component: React.ComponentType<any>;
  props: (stepProps: WizardStepProps) => any;
  requiresScrollWrapper?: boolean;
}

export const createStepMap = (stepProps: WizardStepProps): Record<number, StepComponent> => {
  const { state, setStep, setField, setMode, saveRole, removeRole, updateRolePercent, 
          saveExpense, removeExpense, loadDefaultRoles, setTokenCustomization, 
          setDoAdvancedToken, handleRestart, walletAddress, lastStep } = stepProps;

  return {
    1: {
      component: WizardStep1Describe,
      props: () => ({
        projectIdea: state.projectIdea,
        projectType: state.projectType,
        mode: state.mode,
        walletAddress,
        onSetField: setField,
        onSetMode: setMode,
        onLoadDefaultRoles: loadDefaultRoles,
        canProceed: state.projectIdea && !!state.projectIdea.trim(),
        onNext: () => setStep(2),
      }),
    },
    2: {
      component: WizardStep2Roles,
      props: () => ({
        roles: state.roles,
        editingRoleIdx: state.editingRoleIdx,
        projectType: state.projectType,
        mode: state.mode,
        setField,
        loadDefaultRoles,
        saveRole,
        removeRole,
        setStep,
      }),
      requiresScrollWrapper: true,
    },
    3: {
      component: WizardBudgetStep,
      props: () => ({
        state,
        onUpdateRolePercent: updateRolePercent,
        onSaveExpense: saveExpense,
        onRemoveExpense: removeExpense,
        onSetField: setField,
        onNext: () => setStep(4),
        onBack: () => setStep(2),
      }),
    },
    4: {
      component: WizardStepTokenConfirm,
      props: () => ({
        doAdvancedToken: !!state.doAdvancedToken,
        setDoAdvancedToken,
        onNext: () => {
          console.log("[WizardStepContent] Step 4 onNext, doAdvancedToken:", state.doAdvancedToken);
          if (state.doAdvancedToken) {
            setStep(5);
          } else {
            setStep(lastStep);
          }
        },
        onBack: () => setStep(3),
      }),
      requiresScrollWrapper: true,
    },
    5: {
      component: getStep5Component(state, lastStep),
      props: () => getStep5Props(state, setTokenCustomization, setStep, lastStep, walletAddress, handleRestart),
      requiresScrollWrapper: true,
    },
    [lastStep]: {
      component: WizardStep4Success,
      props: () => ({
        projectIdea: state.projectIdea,
        projectType: state.projectType,
        roles: state.roles,
        expenses: state.expenses,
        pledgeUSDC: state.pledgeUSDC,
        walletAddress,
        tokenCustomization: state.doAdvancedToken ? state.tokenCustomization : undefined,
        onRestart: handleRestart,
      }),
      requiresScrollWrapper: true,
    },
  };
};

function getStep5Component(state: WizardStateData, lastStep: number) {
  if (!state.doAdvancedToken && state.step === lastStep) {
    return WizardStep4Success;
  }
  if (state.doAdvancedToken) {
    return AdvancedTokenCustomizationWrapper;
  }
  return SkippingStepLoader;
}

function getStep5Props(
  state: WizardStateData, 
  setTokenCustomization: any, 
  setStep: any, 
  lastStep: number, 
  walletAddress: string | null, 
  handleRestart: any
) {
  if (!state.doAdvancedToken && state.step === lastStep) {
    return {
      projectIdea: state.projectIdea,
      projectType: state.projectType,
      roles: state.roles,
      expenses: state.expenses,
      pledgeUSDC: state.pledgeUSDC,
      walletAddress,
      tokenCustomization: state.doAdvancedToken ? state.tokenCustomization : undefined,
      onRestart: handleRestart,
    };
  }
  if (state.doAdvancedToken) {
    return {
      state,
      setTokenCustomization,
      setStep,
      onBack: () => setStep(4),
      onNext: () => setStep(lastStep),
    };
  }
  return {};
}
