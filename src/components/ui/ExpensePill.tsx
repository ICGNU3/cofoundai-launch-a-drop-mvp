
import React from "react";
import type { Expense } from "@/hooks/useWizardState";

export type ExpensePillProps = {
  expense: Expense;
  onEdit?: () => void;
  onDelete?: () => void;
};
export const ExpensePill: React.FC<ExpensePillProps> = ({ expense, onEdit, onDelete }) => (
  <span
    className="inline-flex expense-pill items-center cursor-pointer select-none"
    tabIndex={0}
    aria-label={`Edit expense ${expense.expenseName}`}
    onClick={onEdit}
  >
    {expense.expenseName} ${expense.amountUSDC}
    <span className={`ml-2 px-2 py-0.5 text-xs rounded ${
      expense.payoutType === "immediate"
        ? "bg-accent/20 text-accent"
        : "bg-[#ffe7b1]/30 text-yellow-500"
    }`}>
      {expense.payoutType === "immediate" ? "Up Front" : "Upon Outcome"}
    </span>
    {onDelete && (
      <button
        className="ml-2 px-1 text-[15px] font-bold text-accent hover:text-white bg-transparent border-0 cursor-pointer"
        aria-label={`Remove ${expense.expenseName}`}
        onClick={e => { e.stopPropagation(); onDelete && onDelete(); }}
        tabIndex={-1}
        type="button"
      >×</button>
    )}
  </span>
);
