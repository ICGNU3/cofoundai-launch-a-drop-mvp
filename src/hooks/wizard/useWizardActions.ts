
import React from "react";
import type { WizardStateData, WizardStep, Role, Expense, ProjectType, ProjectMode } from "./types";
import { rebalanceRoles } from "./roleHelpers";
import { getDefaultRoles, defaultRole } from "./defaults";

export const useWizardActions = (
  state: WizardStateData,
  setState: React.Dispatch<React.SetStateAction<WizardStateData>>
) => {
  const setStep = (step: WizardStep) => setState(s => ({ ...s, step }));

  const setField = <K extends keyof WizardStateData>(k: K, v: WizardStateData[K]) =>
    setState(s => ({ ...s, [k]: v }));

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
    const presets = getDefaultRoles(type);
    setState(s => ({ ...s, roles: presets }));
  };

  const setMode = (mode: ProjectMode, walletAddress?: string) => {
    setState(s => {
      let roles: Role[] = [];
      if (mode === "solo") {
        roles = [defaultRole("Creator", 100, walletAddress || "")];
      } else {
        // Team mode - start with empty roles so user can add custom ones
        roles = [];
      }
      return { ...s, mode, roles };
    });
  };

  const openWizard = () => setField("isWizardOpen", true);
  const closeWizard = () => setField("isWizardOpen", false);

  const setTokenCustomization = (tc: WizardStateData["tokenCustomization"]) => {
    setState(s => ({ ...s, tokenCustomization: tc }));
  };

  const setDoAdvancedToken = (val: boolean) => {
    setState(s => ({ ...s, doAdvancedToken: val }));
  };

  return {
    setStep,
    setField,
    setMode,
    openWizard,
    closeWizard,
    saveRole,
    removeRole,
    updateRolePercent,
    saveExpense,
    removeExpense,
    loadDefaultRoles,
    setTokenCustomization,
    setDoAdvancedToken,
  };
};
