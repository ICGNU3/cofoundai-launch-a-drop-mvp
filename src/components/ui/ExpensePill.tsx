
import React from "react";

export type ExpensePillProps = {
  expense: { expenseName: string, amountUSDC: number; };
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
