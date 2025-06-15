import React from "react";

// --- UPDATED: Add payoutType ---
export type PayoutType = "immediate" | "uponOutcome";
// Update WizardStep to allow 1, 2, 3, **4** (so step 4 'success' works)
export type WizardStep = 1 | 2 | 3 | 4;

export interface Role {
  roleName: string;
  walletAddress: string;
  percent: number;
  isFixed: false;
}
export interface Expense {
  expenseName: string;
  vendorWallet: string;
  amountUSDC: number;
  isFixed: true;
  payoutType: PayoutType; // ADDED
}
export type ProjectType = "Music" | "Film" | "Fashion" | "Art" | "Other";

export interface WizardStateData {
  step: WizardStep;
  projectIdea: string;
  projectType: ProjectType;
  roles: Role[];
  editingRoleIdx: number | null;
  expenses: Expense[];
  editingExpenseIdx: number | null;
  pledgeUSDC: string;
  walletAddress: string | null;
  isWizardOpen: boolean;
}

const defaultIdea = "Lo-Fi Night Drive EP";
const defaultRole = (roleName: string, percent: number, walletAddress = ""): Role => ({
  roleName,
  walletAddress,
  percent,
  isFixed: false,
});

// --- UPDATED: Add payoutType (default: immediate) to expense creation ---
export function useWizardState() {
  const [state, setState] = React.useState<WizardStateData>({
    step: 1,
    projectIdea: defaultIdea,
    projectType: "Music",
    roles: [defaultRole("Artist", 70), defaultRole("Producer", 30)],
    editingRoleIdx: null,
    expenses: [],
    editingExpenseIdx: null,
    pledgeUSDC: "",
    walletAddress: null,
    isWizardOpen: false,
  });

  const setStep = (step: WizardStep) => setState(s => ({ ...s, step }));

  const setField = <K extends keyof WizardStateData>(k: K, v: WizardStateData[K]) =>
    setState(s => ({ ...s, [k]: v }));

  const saveRole = (role: Role, idx: number|null) => {
    setState(s => {
      let roles = [...s.roles];
      if (idx === null) { roles.push(role); }
      else { roles[idx] = role; }
      return { ...s, roles, editingRoleIdx: null };
    });
  };
  const removeRole = (idx: number) =>
    setState(s => ({
      ...s,
      roles: s.roles.filter((_, i) => i !== idx)
    }));

  const saveExpense = (exp: Expense, idx: number|null) => {
    setState(s => {
      let expenses = [...s.expenses];
      if (idx === null) { expenses.push(exp); }
      else { expenses[idx] = exp; }
      return { ...s, expenses, editingExpenseIdx: null };
    });
  };
  const removeExpense = (idx: number) => setState(s => ({
    ...s, expenses: s.expenses.filter((_, i) => i !== idx)
  }));

  const loadDefaultRoles = (type: ProjectType) => {
    let presets: Role[] = [];
    switch(type) {
      case "Music": presets = [defaultRole("Artist", 70), defaultRole("Producer", 30)]; break;
      case "Film": presets = [defaultRole("Director", 60), defaultRole("Producer", 30), defaultRole("DP", 10)]; break;
      case "Fashion": presets = [defaultRole("Designer", 70), defaultRole("Producer", 30)]; break;
      case "Art": presets = [defaultRole("Artist", 100)]; break;
      default: presets = [defaultRole("Creator", 100)];
    }
    setState(s => ({ ...s, roles: presets }));
  };

  const openWizard = () => setField("isWizardOpen", true);
  const closeWizard = () => setField("isWizardOpen", false);

  return {
    state,
    setState,
    setStep,
    setField,
    openWizard,
    closeWizard,
    saveRole,
    removeRole,
    saveExpense,
    removeExpense,
    loadDefaultRoles,
  };
}
