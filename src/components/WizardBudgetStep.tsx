
import React from "react";
import { WizardNavigationButtons } from "./ui/WizardNavigationButtons";
import { BudgetStepHeader } from "./wizard/step3/BudgetStepHeader";
import { BudgetContentSection } from "./wizard/step3/BudgetContentSection";
import type { WizardStateData, Expense } from "@/hooks/useWizardState";

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
  // Compute sum including both role shares and all expenses
  const roleSum = state.roles.reduce((sum, r) => sum + (r.percentNum || r.percent), 0);
  const expensesSum = state.expenses.reduce((sum, e) => sum + (e.amountUSDC || 0), 0);
  const sumPercent = roleSum + expensesSum;
  const epsilon = 0.1;
  const isRoleBalanceValid = Math.abs(sumPercent - 100) < epsilon;

  const pledgeAmount = Number(state.pledgeUSDC) || 0;
  const hasValidExpense = state.expenses.some(e => e.amountUSDC > 0);

  // Allow proceed if (1) role+expense split sums ~100% OR (2) any expense/pledge
  const canProceed = isRoleBalanceValid || hasValidExpense || pledgeAmount > 0;

  const handleLoadScenario = (scenario: any) => {
    onSetField("roles", scenario.roles);
    onSetField("expenses", scenario.expenses);
    onSetField("pledgeUSDC", scenario.pledgeUSDC);
  };

  return (
    <div className="h-full flex flex-col px-6 py-4">
      <BudgetStepHeader />

      <BudgetContentSection
        state={state}
        sumPercent={sumPercent}
        pledgeAmount={pledgeAmount}
        onUpdateRolePercent={onUpdateRolePercent}
        onSaveExpense={onSaveExpense}
        onRemoveExpense={onRemoveExpense}
        onSetField={onSetField}
        onLoadScenario={handleLoadScenario}
      />

      <div className="border-t border-border pt-4 mt-4 flex-shrink-0">
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
