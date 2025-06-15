import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import { WizardNavigationButtons } from "./ui/WizardNavigationButtons";
import { BudgetValidationStatus } from "./ui/BudgetValidationStatus";
import { BudgetItemsList } from "./ui/BudgetItemsList";
import { InteractiveBudgetChart } from "./ui/InteractiveBudgetChart";
import { ScenarioPlanner } from "./ui/ScenarioPlanner";
import { BudgetOptimizer } from "./ui/BudgetOptimizer";
import type { WizardStateData, Role, Expense } from "@/hooks/useWizardState";

type WizardBudgetStepProps = {
  state: WizardStateData;
  onUpdateRolePercent: (roleIndex: number, newPercent: number) => void;
  onSaveExpense: (expense: Expense, index: number | null) => void;
  onRemoveExpense: (index: number) => void;
  onSetField: <K extends keyof WizardStateData>(key: K, value: WizardStateData[K]) => void;
  onNext: () => void;
  onBack: () => void;
};

export const WizardBudgetStep: React.FC<WizardBudgetStepProps> = ({
  state,
  onUpdateRolePercent,
  onSaveExpense,
  onRemoveExpense,
  onSetField,
  onNext,
  onBack,
}) => {
  const sumPercent = state.roles.reduce((sum, r) => sum + (r.percentNum || r.percent), 0);
  const epsilon = 0.5; // Allow slightly more numerical tolerance
  const isRoleBalanceValid = Math.abs(sumPercent - 100) < epsilon;

  const pledgeAmount = Number(state.pledgeUSDC) || 0;
  const hasValidExpense = state.expenses.some(e => e.amountUSDC > 0);

  // ALLOW: If (1) role split sums ~100% OR (2) any expense or pledge is provided
  const canProceed = isRoleBalanceValid || hasValidExpense || pledgeAmount > 0;

  // Add diagnostic logs for debugging
  // Remove or comment these lines in production!
  console.log('[WizardBudgetStep] sumPercent:', sumPercent, 'isRoleBalanceValid:', isRoleBalanceValid, 'hasValidExpense:', hasValidExpense, 'pledgeAmount:', pledgeAmount, 'canProceed:', canProceed);

  const handleLoadScenario = (scenario: any) => {
    onSetField("roles", scenario.roles);
    onSetField("expenses", scenario.expenses);
    onSetField("pledgeUSDC", scenario.pledgeUSDC);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-headline mb-2">Budget Breakdown</h2>
        <p className="text-body-text/70">
          Allocate your revenue share and manage project expenses. Use the interactive charts to visualize and adjust your budget.
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-6 pr-4">
          {/* Budget Validation Status */}
          <BudgetValidationStatus 
            sumPercent={sumPercent} 
            hasExpenses={state.expenses.length > 0} 
          />

          {/* Interactive Budget Charts */}
          <InteractiveBudgetChart
            roles={state.roles}
            expenses={state.expenses}
            onRolePercentChange={onUpdateRolePercent}
            pledgeAmount={pledgeAmount}
          />

          {/* Budget Items List */}
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

          {/* Scenario Planner */}
          <ScenarioPlanner
            currentRoles={state.roles}
            currentExpenses={state.expenses}
            currentPledge={state.pledgeUSDC}
            projectType={state.projectType}
            onLoadScenario={handleLoadScenario}
          />

          {/* Budget Optimizer */}
          <BudgetOptimizer
            roles={state.roles}
            expenses={state.expenses}
            projectType={state.projectType}
            pledgeAmount={pledgeAmount}
          />

          <div className="h-20" />
        </div>
      </ScrollArea>

      {/* Navigation Buttons - Fixed at bottom */}
      <div className="border-t border-border pt-4 mt-4">
        <WizardNavigationButtons
          canProceed={canProceed}
          onBack={onBack}
          onNext={onNext}
          nextLabel="Continue"
        />
      </div>
    </div>
  );
};
