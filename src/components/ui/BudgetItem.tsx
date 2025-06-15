
import React from "react";
import { Edit, X } from "lucide-react";
import type { Role, Expense } from "@/hooks/useWizardState";

export type BudgetItemType = 
  | (Role & { type: "share" })
  | (Expense & { type: "fixed" });

export type BudgetItemProps = {
  item: BudgetItemType;
  onEdit?: () => void;
  onDelete?: () => void;
};

export const BudgetItem: React.FC<BudgetItemProps> = ({ item, onEdit, onDelete }) => {
  const isShare = item.type === "share";
  
  return (
    <div className="flex items-center justify-between p-3 bg-[#18181a] border border-[#333] rounded-lg transition-all duration-200 hover:border-accent/50">
      <div className="flex items-center gap-3">
        <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
          isShare 
            ? "bg-accent/20 text-accent border border-accent/30" 
            : "bg-[#ffe7b1]/20 text-yellow-500 border border-yellow-500/30"
        }`}>
          {isShare ? (
            <span>{(item as Role).roleName} — {(item as Role).percent}%</span>
          ) : (
            <span>{(item as Expense).expenseName} — ${(item as Expense).amountUSDC}</span>
          )}
        </div>
        {!isShare && (
          <span className={`text-xs px-2 py-1 rounded ${
            (item as Expense).payoutType === "immediate"
              ? "bg-accent/10 text-accent"
              : "bg-yellow-500/10 text-yellow-500"
          }`}>
            {(item as Expense).payoutType === "immediate" ? "Up Front" : "Upon Outcome"}
          </span>
        )}
      </div>
      <div className="flex gap-1">
        {onEdit && (
          <button
            className="p-1 text-accent hover:bg-accent/10 rounded"
            onClick={onEdit}
            type="button"
            aria-label={`Edit ${isShare ? (item as Role).roleName : (item as Expense).expenseName}`}
          >
            <Edit size={14} />
          </button>
        )}
        {onDelete && (
          <button
            className="p-1 text-destructive hover:bg-destructive/10 rounded"
            onClick={onDelete}
            type="button"
            aria-label={`Delete ${isShare ? (item as Role).roleName : (item as Expense).expenseName}`}
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
};
