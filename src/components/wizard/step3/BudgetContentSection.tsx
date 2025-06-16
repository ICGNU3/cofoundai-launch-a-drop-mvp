
import React from "react";
import { BudgetValidationStatus } from "@/components/ui/BudgetValidationStatus";
import { InteractiveBudgetChart } from "@/components/ui/InteractiveBudgetChart";
import { BudgetItemsList } from "@/components/ui/BudgetItemsList";
import { ScenarioPlanner } from "@/components/ui/ScenarioPlanner";
import { BudgetOptimizer } from "@/components/ui/BudgetOptimizer";
import type { WizardStateData, Role, Expense } from "@/hooks/useWizardState";

interface BudgetContentSectionProps {
  state: WizardStateData;
  sumPercent: number;
  pledgeAmount: number;
  onUpdateRolePercent: (roleIndex: number, newPercent: number) => void;
  onSaveExpense: (expense: Expense, index: number | null) => void;
  onRemoveExpense: (index: number) => void;
  onSetField: <K extends keyof WizardStateData>(key: K, value: WizardStateData[K]) => void;
  onLoadScenario: (scenario: any) => void;
}

export const BudgetContentSection: React.FC<BudgetContentSectionProps> = ({
  state,
  sumPercent,
  pledgeAmount,
  onUpdateRolePercent,
  onSaveExpense,
  onRemoveExpense,
  onSetField,
  onLoadScenario,
}) => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-6 pr-4">
        <BudgetValidationStatus 
          sumPercent={sumPercent} 
          hasExpenses={state.expenses.length > 0} 
        />

        <InteractiveBudgetChart
          roles={state.roles}
          expenses={state.expenses}
          onRolePercentChange={onUpdateRolePercent}
          pledgeAmount={pledgeAmount}
        />

        <BudgetItemsList
          roles={state.roles}
          expenses={state.expenses}
          pledgeUSDC={state.pledgeUSDC}
          editingRoleIdx={state.editingRoleIdx}
          editingExpenseIdx={state.editingExpenseIdx}
          onSaveExpense={onSaveExpense}
          onRemoveExpense={onRemoveExpense}
          onSetField={onSetField}
          onUpdateRolePercent={onUpdateRolePercent}
        />

        <ScenarioPlanner
          currentRoles={state.roles}
          currentExpenses={state.expenses}
          currentPledge={state.pledgeUSDC}
          projectType={state.projectType}
          onLoadScenario={onLoadScenario}
        />

        <BudgetOptimizer
          roles={state.roles}
          expenses={state.expenses}
          projectType={state.projectType}
          pledgeAmount={pledgeAmount}
        />

        <div className="h-20" />
      </div>
    </div>
  );
};
