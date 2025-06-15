
import React, { useState } from "react";
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
  const [isEditing, setIsEditing] = useState(false);
  const [tempPercentStr, setTempPercentStr] = useState(
    item.percentStr || (item.percentNum || item.percent || 0).toString()
  );

  const isRole = item.type === "share";

  const handlePercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (v === '' || /^\d{0,3}$/.test(v)) {
      setTempPercentStr(v);
    }
  };

  const handlePercentBlur = () => {
    setIsEditing(false);
    const parsed = parseInt(tempPercentStr, 10);
    const final = isNaN(parsed) || tempPercentStr === '' ? 0 : Math.max(0, Math.min(parsed, 100));
    
    if (onPercentChange) {
      onPercentChange(final);
    }
    
    setTempPercentStr(final.toString());
  };

  const handlePercentKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePercentBlur();
    }
    if (e.key === 'Escape') {
      setTempPercentStr(item.percentStr || (item.percentNum || item.percent || 0).toString());
      setIsEditing(false);
    }
  };

  const handlePercentFocus = () => {
    setIsEditing(true);
    setTempPercentStr(item.percentStr || (item.percentNum || item.percent || 0).toString());
  };

  if (isRole) {
    return (
      <div className="role-pill flex items-center justify-between w-full bg-[#18181a] border border-accent px-3 py-2 rounded">
        <div className="flex items-center gap-2 flex-1">
          <span className="font-medium">{item.roleName}</span>
          <span className="text-xs opacity-60">
            {item.walletAddress?.slice(0, 6)}...{item.walletAddress?.slice(-4)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <input
              type="text"
              value={tempPercentStr}
              onChange={handlePercentChange}
              onBlur={handlePercentBlur}
              onKeyDown={handlePercentKeyDown}
              className="w-12 text-right text-sm bg-transparent border-0 outline-0 font-mono"
              autoFocus
              placeholder="0"
            />
          ) : (
            <span
              className="w-12 text-right text-sm cursor-pointer hover:bg-white/10 px-1 rounded font-mono"
              onClick={handlePercentFocus}
            >
              {item.percentNum || item.percent || 0}
            </span>
          )}
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
    <div className="expense-pill flex items-center justify-between w-full bg-[#18181a] border border-border px-3 py-2 rounded">
      <div className="flex items-center gap-2 flex-1">
        <span className="font-medium">{item.expenseName}</span>
        <span className="text-xs opacity-60">
          {item.payoutType === "immediate" ? "Up Front" : "Upon Outcome"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-mono">${item.amountUSDC?.toFixed(2)}</span>
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
