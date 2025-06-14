
import React, { useState, useEffect } from "react";
import type { PayoutType } from "@/hooks/useWizardState";

interface AddExpenseModalProps {
  open: boolean;
  defaultExpense?: { expenseName: string; vendorWallet: string; amountUSDC: number; payoutType?: PayoutType };
  onClose: () => void;
  onSave: (exp: { expenseName: string; vendorWallet: string; amountUSDC: number; payoutType: PayoutType }) => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  open,
  defaultExpense,
  onClose,
  onSave,
}) => {
  const [expenseName, setExpenseName] = useState(defaultExpense?.expenseName || "");
  const [vendorWallet, setVendorWallet] = useState(defaultExpense?.vendorWallet || "");
  const [amountUSDC, setAmountUSDC] = useState(defaultExpense?.amountUSDC ?? 0);
  const [payoutType, setPayoutType] = useState<PayoutType>(defaultExpense?.payoutType || "immediate");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setExpenseName(defaultExpense?.expenseName || "");
    setVendorWallet(defaultExpense?.vendorWallet || "");
    setAmountUSDC(defaultExpense?.amountUSDC ?? 0);
    setPayoutType(defaultExpense?.payoutType || "immediate");
    setError(null);
  }, [open, defaultExpense]);

  function handleSave() {
    if (!expenseName.trim()) return setError("Expense name required");
    if (!vendorWallet.trim()) return setError("Vendor wallet required");
    if (amountUSDC < 0) return setError("Amount must be ≥ 0");
    onSave({
      expenseName: expenseName.trim(),
      vendorWallet: vendorWallet.trim(),
      amountUSDC,
      payoutType
    });
  }
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="bg-card border border-border rounded-lg shadow-lg p-6 w-full max-w-xs relative">
        <button className="absolute right-2 top-2 text-lg" onClick={onClose}>&times;</button>
        <h3 className="font-bold mb-2">Add/Edit Expense</h3>
        <input
          className="w-full mb-2 p-2 rounded bg-[#232323] border border-border text-body-text"
          placeholder="Expense Name"
          value={expenseName}
          onChange={e => setExpenseName(e.target.value)}
        />
        <input
          className="w-full mb-2 p-2 rounded bg-[#232323] border border-border text-body-text"
          placeholder="Vendor Wallet (0x…)"
          value={vendorWallet}
          onChange={e => setVendorWallet(e.target.value)}
        />
        <input
          className="w-full mb-2 p-2 rounded bg-[#232323] border border-border text-body-text"
          type="number"
          min={0}
          placeholder="Amount (USDC)"
          value={amountUSDC}
          onChange={e => setAmountUSDC(Number(e.target.value))}
        />
        <div className="mb-2">
          <label className="block font-medium text-sm text-body-text mb-1">Payout Timing:</label>
          <select
            className="w-full rounded bg-[#222] text-body-text border border-border py-2"
            value={payoutType}
            onChange={e => setPayoutType(e.target.value as PayoutType)}
          >
            <option value="immediate">Pay Up Front</option>
            <option value="uponOutcome">Pay Upon Outcome</option>
          </select>
        </div>
        {error && <div className="text-red-500 text-[13px] mb-1">{error}</div>}
        <button className="accent-btn w-full mt-2" onClick={handleSave}>Save Expense</button>
      </div>
    </div>
  );
};
