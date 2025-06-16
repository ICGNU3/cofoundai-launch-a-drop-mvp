
import React from "react";

export const BudgetStepHeader: React.FC = () => {
  return (
    <div className="mb-4 flex-shrink-0">
      <h2 className="text-2xl font-bold text-headline mb-2">Budget Breakdown</h2>
      <p className="text-body-text/70">
        Allocate your revenue share and manage project expenses. Use the interactive charts to visualize and adjust your budget.
      </p>
    </div>
  );
};
