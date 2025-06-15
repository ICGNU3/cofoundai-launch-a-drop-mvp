
import React from "react";
import { PercentBar } from "./PercentBar";

type BudgetValidationStatusProps = {
  sumPercent: number;
  hasExpenses: boolean;
};

export const BudgetValidationStatus: React.FC<BudgetValidationStatusProps> = ({
  sumPercent,
  hasExpenses,
}) => {
  const percentColor = sumPercent === 100 ? "text-green-400" : "text-red-500";
  const percentMsg = sumPercent < 100 && !hasExpenses
    ? `Need ${100 - sumPercent}% more` 
    : sumPercent > 100 
    ? `Remove ${sumPercent - 100}%` 
    : sumPercent === 100
    ? "Percentages balanced ✓"
    : `${100 - sumPercent}% remaining`;

  return (
    <>
      <PercentBar used={sumPercent} />
      <div className={`text-sm font-semibold ${percentColor} mb-4`}>
        {percentMsg}
      </div>
    </>
  );
};
