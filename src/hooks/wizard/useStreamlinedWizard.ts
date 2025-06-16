
import { useState } from "react";

export type ProjectType = "Music" | "Film" | "Fashion" | "Art" | "Other";
export type ProjectMode = "solo" | "team";

export interface Role {
  name: string;
  percent: number;
  percentNum: number;
  percentStr: string;
  address: string;
  isFixed: boolean;
}

export interface Expense {
  name: string;
  amountUSDC: number;
  description: string;
}

export interface StreamlinedWizardState {
  step: 1 | 2 | 3;
  isOpen: boolean;
  
  // Step 1: Project Basics
  projectIdea: string;
  projectType: ProjectType;
  mode: ProjectMode;
  
  // Step 2: Team & Budget (Combined)
  roles: Role[];
  expenses: Expense[];
  pledgeUSDC: string;
  
  // Step 3: Launch Settings
  doAdvancedToken: boolean;
  tokenCustomization?: any;
}

const initialState: StreamlinedWizardState = {
  step: 1,
  isOpen: false,
  projectIdea: "",
  projectType: "Music",
  mode: "solo",
  roles: [],
  expenses: [],
  pledgeUSDC: "",
  doAdvancedToken: false,
};

export function useStreamlinedWizard() {
  const [state, setState] = useState<StreamlinedWizardState>(initialState);

  const updateField = <K extends keyof StreamlinedWizardState>(
    field: K,
    value: StreamlinedWizardState[K]
  ) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    setState(prev => ({ 
      ...prev, 
      step: Math.min(3, prev.step + 1) as 1 | 2 | 3 
    }));
  };

  const prevStep = () => {
    setState(prev => ({ 
      ...prev, 
      step: Math.max(1, prev.step - 1) as 1 | 2 | 3 
    }));
  };

  const openWizard = () => updateField("isOpen", true);
  const closeWizard = () => setState(initialState);

  const resetWizard = () => {
    setState(prev => ({ ...initialState, isOpen: prev.isOpen }));
  };

  return {
    state,
    updateField,
    nextStep,
    prevStep,
    openWizard,
    closeWizard,
    resetWizard,
  };
}
