import React from "react";

// --- UPDATED: Add payoutType ---
export type PayoutType = "immediate" | "uponOutcome";
// Update WizardStep to allow 1, 2, 3, **4** (so step 4 'success' works)
export type WizardStep = 1 | 2 | 3 | 4;

export interface Role {
  roleName: string;
  walletAddress: string;
  percent: number; // Keep for backward compatibility
  percentNum: number; // For calculations
  percentStr: string; // For input display
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
  percentNum: percent,
  percentStr: percent.toString(),
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

  // Auto-rebalance helper function
  const rebalanceRoles = (roles: Role[], changedRoleIdx?: number) => {
    const sum = roles.reduce((s, r) => s + r.percentNum, 0);
    
    if (sum === 100) {
      // Update percent for backward compatibility
      return roles.map(r => ({ ...r, percent: r.percentNum }));
    }

    const difference = 100 - sum;
    const changedRole = changedRoleIdx !== undefined ? roles[changedRoleIdx] : null;
    const otherRoles = roles.filter((_, i) => i !== changedRoleIdx && roles[i].percentNum > 0);
    const otherSum = otherRoles.reduce((s, r) => s + r.percentNum, 0);

    if (otherSum === 0) {
      // If no other roles to distribute to, keep as is
      return roles.map(r => ({ ...r, percent: r.percentNum }));
    }

    // Distribute difference proportionally
    const rebalanced = roles.map((role, i) => {
      if (i === changedRoleIdx || role.percentNum === 0) {
        return { ...role, percent: role.percentNum };
      }
      
      const proportion = role.percentNum / otherSum;
      const adjustment = Math.round(difference * proportion);
      const newPercent = Math.max(0, Math.min(100, role.percentNum + adjustment));
      
      return {
        ...role,
        percentNum: newPercent,
        percentStr: newPercent.toString(),
        percent: newPercent
      };
    });

    // Final adjustment to ensure exactly 100%
    const finalSum = rebalanced.reduce((s, r) => s + r.percentNum, 0);
    const finalDiff = 100 - finalSum;
    
    if (finalDiff !== 0) {
      // Distribute +/-1 to first few roles
      for (let i = 0; i < rebalanced.length && finalDiff !== 0; i++) {
        if (i !== changedRoleIdx && rebalanced[i].percentNum > 0) {
          const adjustment = finalDiff > 0 ? 1 : -1;
          rebalanced[i].percentNum += adjustment;
          rebalanced[i].percentStr = rebalanced[i].percentNum.toString();
          rebalanced[i].percent = rebalanced[i].percentNum;
        }
      }
    }

    return rebalanced;
  };

  const saveRole = (role: Role, idx: number|null) => {
    setState(s => {
      let roles = [...s.roles];
      const newRole = {
        ...role,
        percentNum: role.percent || role.percentNum || 0,
        percentStr: (role.percent || role.percentNum || 0).toString()
      };
      
      if (idx === null) { 
        roles.push(newRole); 
      } else { 
        roles[idx] = newRole; 
      }
      
      // Rebalance after adding/updating
      roles = rebalanceRoles(roles, idx);
      
      return { ...s, roles, editingRoleIdx: null };
    });
  };
  const removeRole = (idx: number) =>
    setState(s => {
      const roles = s.roles.filter((_, i) => i !== idx);
      const rebalanced = rebalanceRoles(roles);
      return { ...s, roles: rebalanced };
    });

  const updateRolePercent = (idx: number, newPercent: number) => {
    setState(s => {
      const roles = [...s.roles];
      roles[idx] = {
        ...roles[idx],
        percentNum: newPercent,
        percentStr: newPercent.toString(),
        percent: newPercent
      };
      
      const rebalanced = rebalanceRoles(roles, idx);
      return { ...s, roles: rebalanced };
    });
  };

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
    updateRolePercent,
    saveExpense,
    removeExpense,
    loadDefaultRoles,
  };
}
