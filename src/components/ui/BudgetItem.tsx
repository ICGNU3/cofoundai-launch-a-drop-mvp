
import React from "react";
import { Pencil, Trash2 } from "lucide-react";

export type BudgetItemType = {
  type: "share" | "fixed";
  roleName?: string;
  walletAddress?: string;
  percentNum?: number;
  percentStr?: string;
  percent?: number;
  isFixed?: boolean;
  expenseName?: string;
  amountUSDC?: number;
  payoutType?: "immediate" | "uponOutcome";
};

type BudgetItemProps = {
  item: BudgetItemType;
  onEdit: () => void;
  onDelete: () => void;
  onPercentChange?: (newPercent: number) => void;
};

export const BudgetItem: React.FC<BudgetItemProps> = ({
  item,
  onEdit,
  onDelete,
  onPercentChange,
}) => {
  const isRole = item.type === "share";

  if (isRole) {
    return (
      <div className="role-pill flex items-center justify-between w-full">
        <div className="flex items-center gap-2 flex-1">
          <span className="font-medium">{item.roleName}</span>
          <span className="text-xs opacity-60">
            {item.walletAddress?.slice(0, 6)}...{item.walletAddress?.slice(-4)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={item.percentStr || (item.percentNum || item.percent || 0).toString()}
            onChange={(e) => {
              const v = e.target.value;
              if (v === '' || /^\d{0,3}$/.test(v)) {
                // This would need to be handled by parent component
                console.log('Percent change:', v);
              }
            }}
            onBlur={(e) => {
              const parsed = parseInt(e.target.value, 10);
              const final = isNaN(parsed) ? 0 : Math.min(parsed, 100);
              if (onPercentChange) {
                onPercentChange(final);
              }
            }}
            className="w-12 text-right text-sm bg-transparent border-0 outline-0"
          />
          <span className="text-sm">%</span>
          <button
            onClick={onEdit}
            className="p-1 hover:bg-white/10 rounded"
            aria-label="Edit role"
          >
            <Pencil className="w-3 h-3" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 hover:bg-red-500/20 rounded text-red-400"
            aria-label="Delete role"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  // Expense item
  return (
    <div className="expense-pill flex items-center justify-between w-full">
      <div className="flex items-center gap-2 flex-1">
        <span className="font-medium">{item.expenseName}</span>
        <span className="text-xs opacity-60">
          {item.payoutType === "immediate" ? "Up Front" : "Upon Outcome"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">${item.amountUSDC?.toFixed(2)}</span>
        <button
          onClick={onEdit}
          className="p-1 hover:bg-white/10 rounded"
          aria-label="Edit expense"
        >
          <Pencil className="w-3 h-3" />
        </button>
        <button
          onClick={onDelete}
          className="p-1 hover:bg-red-500/20 rounded text-red-400"
          aria-label="Delete expense"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
