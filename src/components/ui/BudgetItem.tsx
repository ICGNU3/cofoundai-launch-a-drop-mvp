
import React from "react";
import { motion } from "framer-motion";
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
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex items-center justify-between p-3 bg-[#18181a] border border-[#333] rounded-lg transition-all duration-200 hover:border-accent/50 mobile-budget-item"
    >
      <div className="flex items-center gap-3 mobile-budget-content">
        <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium mobile-budget-pill ${
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
          <span className={`text-xs px-2 py-1 rounded mobile-payout-type ${
            (item as Expense).payoutType === "immediate"
              ? "bg-accent/10 text-accent"
              : "bg-yellow-500/10 text-yellow-500"
          }`}>
            {(item as Expense).payoutType === "immediate" ? "Up Front" : "Upon Outcome"}
          </span>
        )}
      </div>
      <div className="flex gap-1 mobile-budget-actions">
        {onEdit && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1 text-accent hover:bg-accent/10 rounded focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            onClick={onEdit}
            type="button"
            aria-label={`Edit ${isShare ? (item as Role).roleName : (item as Expense).expenseName}`}
          >
            <Edit size={14} />
          </motion.button>
        )}
        {onDelete && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1 text-red-400 hover:bg-red-400/10 rounded focus-visible:outline-2 focus-visible:outline-red-400 focus-visible:outline-offset-2"
            onClick={onDelete}
            type="button"
            aria-label={`Delete ${isShare ? (item as Role).roleName : (item as Expense).expenseName}`}
          >
            <X size={14} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};
