
import React, { useState } from "react";
import { Plus } from "lucide-react";
import type { Role, Expense } from "@/hooks/useWizardState";

type AddBudgetItemFormProps = {
  onAddRole: (role: Role) => void;
  onAddExpense: (expense: Expense) => void;
  existingRoles: Role[];
};

export const AddBudgetItemForm: React.FC<AddBudgetItemFormProps> = ({
  onAddRole,
  onAddExpense,
  existingRoles,
}) => {
  const [itemType, setItemType] = useState<"role" | "expense">("role");
  const [roleName, setRoleName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [expenseName, setExpenseName] = useState("");
  const [amountUSDC, setAmountUSDC] = useState("");
  const [vendorWallet, setVendorWallet] = useState("");
  const [payoutType, setPayoutType] = useState<"immediate" | "uponOutcome">("immediate");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (itemType === "role" && roleName.trim() && walletAddress.trim()) {
      const newRole: Role = {
        roleName: roleName.trim(),
        walletAddress: walletAddress.trim(),
        percent: 10,
        percentNum: 10,
        percentStr: "10",
        isFixed: false,
      };
      onAddRole(newRole);
      setRoleName("");
      setWalletAddress("");
    } else if (itemType === "expense" && expenseName.trim() && amountUSDC && vendorWallet.trim()) {
      const newExpense: Expense = {
        expenseName: expenseName.trim(),
        vendorWallet: vendorWallet.trim(),
        amountUSDC: parseFloat(amountUSDC),
        payoutType,
        isFixed: true,
      };
      onAddExpense(newExpense);
      setExpenseName("");
      setAmountUSDC("");
      setVendorWallet("");
    }
  };

  return (
    <div className="border border-border rounded-lg p-4 bg-card/50">
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setItemType("role")}
          className={`px-3 py-1 rounded text-sm ${
            itemType === "role" 
              ? "bg-accent text-background" 
              : "border border-border text-body-text hover:bg-accent/10"
          }`}
        >
          Revenue Share
        </button>
        <button
          type="button"
          onClick={() => setItemType("expense")}
          className={`px-3 py-1 rounded text-sm ${
            itemType === "expense" 
              ? "bg-accent text-background" 
              : "border border-border text-body-text hover:bg-accent/10"
          }`}
        >
          Fixed Expense
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {itemType === "role" ? (
          <>
            <input
              type="text"
              placeholder="Role name (e.g., Producer)"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full p-2 rounded border border-border bg-background text-body-text"
              required
            />
            <input
              type="text"
              placeholder="Wallet address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="w-full p-2 rounded border border-border bg-background text-body-text"
              required
            />
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Expense name (e.g., Studio rental)"
              value={expenseName}
              onChange={(e) => setExpenseName(e.target.value)}
              className="w-full p-2 rounded border border-border bg-background text-body-text"
              required
            />
            <input
              type="text"
              placeholder="Vendor wallet address"
              value={vendorWallet}
              onChange={(e) => setVendorWallet(e.target.value)}
              className="w-full p-2 rounded border border-border bg-background text-body-text"
              required
            />
            <input
              type="number"
              placeholder="Amount in USDC"
              value={amountUSDC}
              onChange={(e) => setAmountUSDC(e.target.value)}
              className="w-full p-2 rounded border border-border bg-background text-body-text"
              min="0"
              step="0.01"
              required
            />
            <select
              value={payoutType}
              onChange={(e) => setPayoutType(e.target.value as "immediate" | "uponOutcome")}
              className="w-full p-2 rounded border border-border bg-background text-body-text"
            >
              <option value="immediate">Pay Up Front</option>
              <option value="uponOutcome">Pay Upon Outcome</option>
            </select>
          </>
        )}
        
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 p-2 bg-accent text-background rounded hover:bg-accent/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add {itemType === "role" ? "Role" : "Expense"}
        </button>
      </form>
    </div>
  );
};
