
import React, { useState } from "react";
import { AccentButton } from "./ui/AccentButton";
import { AddRoleModal } from "./ui/AddRoleModal";
import { AddExpenseModal } from "./ui/AddExpenseModal";
import { ProjectTypeSelector } from "./ui/ProjectTypeSelector";
import { RoleTemplateManager } from "./ui/RoleTemplateManager";
import { BudgetItemsList } from "./ui/BudgetItemsList";
import { BudgetValidationStatus } from "./ui/BudgetValidationStatus";
import { InteractiveBudgetChart } from "./ui/InteractiveBudgetChart";
import { ScenarioPlanner } from "./ui/ScenarioPlanner";
import { BudgetOptimizer } from "./ui/BudgetOptimizer";
import type { Role, Expense, ProjectType } from "@/hooks/useWizardState";

type WizardBudgetStepProps = {
  roles: Role[];
  expenses: Expense[];
  editingRoleIdx: number | null;
  editingExpenseIdx: number | null;
  projectType: ProjectType;
  pledgeUSDC: string;
  setField: (field: keyof any, value: any) => void;
  loadDefaultRoles: (type: ProjectType) => void;
  saveRole: (role: Role, idx: number | null) => void;
  removeRole: (idx: number) => void;
  updateRolePercent?: (idx: number, newPercent: number) => void;
  saveExpense: (expense: Expense, idx: number | null) => void;
  removeExpense: (idx: number) => void;
  setStep: (s: 1 | 2 | 3) => void;
};

export const WizardBudgetStep: React.FC<WizardBudgetStepProps> = ({
  roles,
  expenses,
  editingRoleIdx,
  editingExpenseIdx,
  projectType,
  pledgeUSDC,
  setField,
  loadDefaultRoles,
  saveRole,
  removeRole,
  updateRolePercent,
  saveExpense,
  removeExpense,
  setStep,
}) => {
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);

  // Enhanced percent validation with epsilon tolerance
  const sumPercent = roles.reduce((sum, r) => sum + (r.percentNum || r.percent), 0);
  const epsilon = 0.1;
  const canProceed = Math.abs(sumPercent - 100) < epsilon;

  const pledgeAmount = Number(pledgeUSDC) || 0;

  const handleAddRole = (newRole: Role) => {
    const roleWithPercent: Role = {
      ...newRole,
      percentNum: newRole.percent || 10,
      percentStr: (newRole.percent || 10).toString(),
      isFixed: false
    };
    
    saveRole(roleWithPercent, null);
  };

  const handleEditRole = (index: number) => {
    setField("editingRoleIdx", index);
    setRoleModalOpen(true);
  };

  const handleEditExpense = (index: number) => {
    setField("editingExpenseIdx", index);
    setExpenseModalOpen(true);
  };

  const handleLoadTemplate = (templateRoles: Role[]) => {
    setField("roles", templateRoles);
  };

  const handleAddRoleClick = () => {
    setField("editingRoleIdx", null);
    setRoleModalOpen(true);
  };

  const handleAddExpenseClick = () => {
    setField("editingExpenseIdx", null);
    setExpenseModalOpen(true);
  };

  const handleLoadScenario = (scenario: any) => {
    setField("roles", scenario.roles);
    setField("expenses", scenario.expenses);
    setField("pledgeUSDC", scenario.pledgeUSDC);
  };

  return (
    <div className="space-y-6">
      <h2 className="headline text-center mb-6">Interactive Budget Hub</h2>
      
      {/* Project Configuration */}
      <div className="space-y-4">
        <ProjectTypeSelector
          projectType={projectType}
          onProjectTypeChange={(type) => setField("projectType", type)}
          onLoadDefaultRoles={loadDefaultRoles}
        />

        <RoleTemplateManager
          roles={roles}
          onLoadTemplate={handleLoadTemplate}
        />
      </div>

      {/* Interactive Visualizations */}
      <InteractiveBudgetChart
        roles={roles}
        expenses={expenses}
        onRolePercentChange={updateRolePercent || (() => {})}
        pledgeAmount={pledgeAmount}
      />

      {/* Scenario Planning */}
      <ScenarioPlanner
        currentRoles={roles}
        currentExpenses={expenses}
        currentPledge={pledgeUSDC}
        projectType={projectType}
        onLoadScenario={handleLoadScenario}
      />

      {/* Budget Optimization */}
      <BudgetOptimizer
        roles={roles}
        expenses={expenses}
        projectType={projectType}
        pledgeAmount={pledgeAmount}
      />

      {/* Current Status */}
      <BudgetValidationStatus
        sumPercent={sumPercent}
        hasExpenses={expenses.length > 0}
      />

      {/* Budget Items List */}
      <BudgetItemsList
        roles={roles}
        expenses={expenses}
        onEditRole={handleEditRole}
        onEditExpense={handleEditExpense}
        onDeleteRole={removeRole}
        onDeleteExpense={removeExpense}
        onUpdateRolePercent={updateRolePercent}
      />

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <AccentButton
          secondary
          onClick={handleAddRoleClick}
          className="w-full"
        >
          + Add Role
        </AccentButton>
        
        <AccentButton
          secondary
          onClick={handleAddExpenseClick}
          className="w-full"
        >
          + Add Expense
        </AccentButton>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        <AccentButton
          secondary
          className="flex-1"
          onClick={() => setStep(1)}
        >
          ← Back
        </AccentButton>
        <AccentButton
          className="flex-1"
          disabled={!canProceed}
          onClick={() => setStep(3)}
        >
          Mint & Fund →
        </AccentButton>
      </div>

      {/* Modals */}
      <AddRoleModal
        open={roleModalOpen}
        defaultRole={editingRoleIdx !== null ? roles[editingRoleIdx] : undefined}
        onClose={() => setRoleModalOpen(false)}
        onSave={role => {
          const roleWithPercent: Role = {
            ...role,
            percentNum: role.percent || 10,
            percentStr: (role.percent || 10).toString(),
            isFixed: false
          };
          saveRole(roleWithPercent, editingRoleIdx);
          setRoleModalOpen(false);
        }}
        existingRoles={roles}
      />
      
      <AddExpenseModal
        open={expenseModalOpen}
        defaultExpense={editingExpenseIdx !== null ? expenses[editingExpenseIdx] : undefined}
        onClose={() => setExpenseModalOpen(false)}
        onSave={expense => {
          saveExpense({ ...expense, isFixed: true }, editingExpenseIdx);
          setExpenseModalOpen(false);
        }}
      />
    </div>
  );
};
