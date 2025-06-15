
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
  const epsilon = 0.1;
  const isValid = Math.abs(sumPercent - 100) < epsilon;
  
  let percentColor = "";
  let percentMsg = "";
  
  if (sumPercent < 100 - epsilon) {
    percentMsg = `Need ${Math.round((100 - sumPercent) * 10) / 10}% more`;
    percentColor = "text-red-500";
  } else if (sumPercent > 100 + epsilon) {
    percentMsg = `Remove ${Math.round((sumPercent - 100) * 10) / 10}%`;
    percentColor = "text-red-500";
  } else {
    percentMsg = "Cuts balanced ✓";
    percentColor = "text-green-400";
  }

  return (
    <>
      <PercentBar used={sumPercent} />
      <div className={`text-sm font-semibold ${percentColor} mb-4`}>
        {percentMsg}
      </div>
    </>
  );
};
