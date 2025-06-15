
import React from "react";
import type { Role, Expense } from "@/hooks/useWizardState";

interface ProjectPreviewCardProps {
  roles: Role[];
  expenses: Expense[];
}

export const ProjectPreviewCard: React.FC<ProjectPreviewCardProps> = ({
  roles,
  expenses,
}) => {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="font-semibold text-body-text mb-3">Team & Budget</h3>
      <div className="space-y-2 text-sm">
        {roles.map((role, i) => (
          <div key={i} className="flex justify-between">
            <span>{role.roleName}</span>
            <span>{role.percent}%</span>
          </div>
        ))}
      </div>
      <hr className="my-3 border-border" />
      <div className="space-y-1 text-sm">
        {expenses.map((expense, i) => (
          <div key={i} className="flex justify-between">
            <span>{expense.expenseName}</span>
            <span>${expense.amountUSDC} {expense.payoutType === "immediate" ? "(Upfront)" : "(On Success)"}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
