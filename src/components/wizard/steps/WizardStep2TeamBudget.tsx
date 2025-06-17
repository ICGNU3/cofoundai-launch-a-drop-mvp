
import React, { useState } from "react";
import type { StreamlinedWizardState } from "@/hooks/wizard/useStreamlinedWizard";
import { TeamBudgetHeader } from "./step2/TeamBudgetHeader";
import { RolesSection } from "./step2/RolesSection";
import { ExpensesSection } from "./step2/ExpensesSection";
import { Step2Navigation } from "./step2/Step2Navigation";

interface WizardStep2TeamBudgetProps {
  state: StreamlinedWizardState;
  updateField: <K extends keyof StreamlinedWizardState>(field: K, value: StreamlinedWizardState[K]) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const WizardStep2TeamBudget: React.FC<WizardStep2TeamBudgetProps> = ({
  state,
  updateField,
  nextStep,
  prevStep,
}) => {
  const [editingRole, setEditingRole] = useState<number | null>(null);
  const [editingExpense, setEditingExpense] = useState<number | null>(null);

  const handleAddRole = () => {
    // Mock implementation - in real app would open a modal
    const newRole = {
      name: "New Team Member",
      percent: 0,
      percentNum: 0,
      percentStr: "0",
      address: "",
      isFixed: false,
    };
    
    updateField("roles", [...state.roles, newRole]);
  };

  const handleEditRole = (index: number) => {
    setEditingRole(index);
    // In real implementation, this would open a modal for editing
  };

  const handleRemoveRole = (index: number) => {
    const newRoles = state.roles.filter((_, i) => i !== index);
    updateField("roles", newRoles);
  };

  const handleAddExpense = () => {
    // Mock implementation - in real app would open a modal
    const newExpense = {
      name: "New Expense",
      amountUSDC: 0,
      description: "Project expense",
    };
    
    updateField("expenses", [...state.expenses, newExpense]);
  };

  const handleEditExpense = (index: number) => {
    setEditingExpense(index);
    // In real implementation, this would open a modal for editing
  };

  const handleRemoveExpense = (index: number) => {
    const newExpenses = state.expenses.filter((_, i) => i !== index);
    updateField("expenses", newExpenses);
  };

  // Check if we can proceed to next step
  const totalRolePercent = state.roles.reduce((sum, role) => sum + role.percentNum, 0);
  const canProceed = state.mode === "solo" || (state.roles.length > 0 && totalRolePercent === 100);

  return (
    <div className="p-3 sm:p-6 space-y-3 sm:space-y-6">
      <TeamBudgetHeader />

      <RolesSection
        mode={state.mode}
        roles={state.roles}
        onAddRole={handleAddRole}
        onEditRole={handleEditRole}
        onRemoveRole={handleRemoveRole}
      />

      <ExpensesSection
        expenses={state.expenses}
        onAddExpense={handleAddExpense}
        onEditExpense={handleEditExpense}
        onRemoveExpense={handleRemoveExpense}
      />

      <Step2Navigation
        onBack={prevStep}
        onNext={nextStep}
        canProceed={canProceed}
      />
    </div>
  );
};
