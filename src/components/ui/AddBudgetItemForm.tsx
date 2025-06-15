
import React, { useState } from "react";
import { AccentButton } from "./AccentButton";
import type { Role, Expense, PayoutType } from "@/hooks/useWizardState";

type ItemType = "share" | "fixed";

interface AddBudgetItemFormProps {
  onAddRole: (role: Role) => void;
  onAddExpense: (expense: Expense) => void;
  existingRoles: Role[];
}

export const AddBudgetItemForm: React.FC<AddBudgetItemFormProps> = ({
  onAddRole,
  onAddExpense,
  existingRoles
}) => {
  const [itemType, setItemType] = useState<ItemType>("share");
  const [name, setName] = useState("");
  const [wallet, setWallet] = useState("");
  const [value, setValue] = useState("");
  const [payoutType, setPayoutType] = useState<PayoutType>("immediate");

  const handleAdd = () => {
    if (!name.trim() || !wallet.trim() || !value.trim()) return;

    if (itemType === "share") {
      const percent = Number(value);
      if (percent <= 0 || percent > 100) return;
      
      onAddRole({
        roleName: name.trim(),
        walletAddress: wallet.trim(),
        percent,
        isFixed: false
      });
    } else {
      const amount = Number(value);
      if (amount <= 0) return;
      
      onAddExpense({
        expenseName: name.trim(),
        vendorWallet: wallet.trim(),
        amountUSDC: amount,
        isFixed: true,
        payoutType
      });
    }

    // Reset form
    setName("");
    setWallet("");
    setValue("");
  };

  return (
    <div className="p-4 bg-[#1a1a1a] border border-[#333] rounded-lg">
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <select
            value={itemType}
            onChange={(e) => setItemType(e.target.value as ItemType)}
            className="px-3 py-2 text-sm border border-[#333] rounded bg-[#232323]"
          >
            <option value="share">Share %</option>
            <option value="fixed">Fixed $</option>
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-3 py-2 text-sm border border-[#333] rounded bg-[#232323]"
          />
          <input
            placeholder="Wallet"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            className="px-3 py-2 text-sm border border-[#333] rounded bg-[#232323]"
          />
        </div>
        
        <div className="flex gap-2">
          <input
            type="number"
            placeholder={itemType === "share" ? "Percent" : "USDC Amount"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            min="0"
            step={itemType === "share" ? "1" : "0.01"}
            max={itemType === "share" ? "100" : undefined}
            className="flex-1 px-3 py-2 text-sm border border-[#333] rounded bg-[#232323]"
          />
          
          {itemType === "fixed" && (
            <select
              value={payoutType}
              onChange={(e) => setPayoutType(e.target.value as PayoutType)}
              className="px-3 py-2 text-sm border border-[#333] rounded bg-[#232323]"
            >
              <option value="immediate">Up Front</option>
              <option value="uponOutcome">Upon Outcome</option>
            </select>
          )}
        </div>
        
        <AccentButton
          onClick={handleAdd}
          disabled={!name.trim() || !wallet.trim() || !value.trim()}
          className="w-full text-sm h-9"
        >
          Add Line Item
        </AccentButton>
      </div>
    </div>
  );
};
