
import React, { useState } from "react";
import { AccentButton } from "./ui/AccentButton";
import { ExpensePill } from "./ui/ExpensePill";
import { AddExpenseModal } from "./ui/AddExpenseModal";

import type { Expense } from "@/hooks/useWizardState";

interface WizardStep3ExpensesProps {
  expenses: Expense[];
  editingExpenseIdx: number | null;
  setField: (k: string, v: any) => void;
  saveExpense: (exp: Expense, idx: number|null) => void;
  removeExpense: (idx: number) => void;
  pledgeUSDC: string;
  walletAddress: string | null;
  setStep: (s: 1 | 2 | 3 | 4) => void;
}

export const WizardStep3Expenses: React.FC<WizardStep3ExpensesProps> = ({
  expenses,
  editingExpenseIdx,
  setField,
  saveExpense,
  removeExpense,
  pledgeUSDC,
  walletAddress,
  setStep,
}) => {
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);

  const upfrontExpenses = expenses.filter(e => e.payoutType === "immediate");
  const uponOutcomeExpenses = expenses.filter(e => e.payoutType === "uponOutcome");
  const expenseSum = upfrontExpenses.reduce((sum, x) => sum + x.amountUSDC, 0);
  const outcomeSum = uponOutcomeExpenses.reduce((sum, x) => sum + x.amountUSDC, 0);
  const pledgeNum = Number(pledgeUSDC) || 0;

  return (
    <div>
      <h2 className="headline text-center mb-2">Expenses &amp; Funding</h2>
      <div>
        {/* Expense Pills */}
        <div className="mb-2 flex flex-wrap gap-2">
          {[...upfrontExpenses, ...uponOutcomeExpenses].map((expense, i) => (
            <ExpensePill
              key={i}
              expense={expense}
              onEdit={() => {
                setField("editingExpenseIdx", i);
                setExpenseModalOpen(true);
              }}
              onDelete={() => removeExpense(i)}
            />
          ))}
          <button
            className="expense-pill bg-[#292929] text-accent border-accent hover:bg-accent/10 ml-1"
            onClick={() => {
              setField("editingExpenseIdx", null);
              setExpenseModalOpen(true);
            }}
            aria-label="Add Expense"
            type="button"
          >+ Add Expense</button>
        </div>
        <div className="text-body-text text-sm opacity-80 mb-2">
          <span className="font-semibold text-accent">{upfrontExpenses.length} Up Front</span> &middot;{" "}
          <span className="font-semibold text-yellow-500">{uponOutcomeExpenses.length} Upon Outcome</span>
        </div>
        <div className="text-body-text text-sm opacity-80 mb-2">
          Up front expenses: <span className="font-semibold text-accent">${expenseSum.toFixed(2)}</span><br/>
          Upon outcome: <span className="font-semibold text-yellow-500">${outcomeSum.toFixed(2)}</span>
        </div>
        <div className="text-body-text text-sm opacity-80 mb-2">
          You need <span className="font-semibold text-accent">${expenseSum.toFixed(2)}</span> USDC +{' '}
          {pledgeNum > 0 ? <>{pledgeNum} (pledge)</> : <>any extra for revenue splits</>}
        </div>
        <label className="block mt-5 mb-1 font-semibold text-body-text">
          (Optional) Pledge in USDC
        </label>
        <input
          type="number"
          inputMode="decimal"
          min={0}
          step="0.01"
          placeholder="e.g. 100"
          value={pledgeUSDC}
          onChange={e => setField("pledgeUSDC", e.target.value.replace(/^0+/, ""))}
          className="w-full mb-1"
        />
        <div className="flex flex-col gap-3 mt-6">
          {/* Simulate Connect Wallet as button */}
          {!walletAddress ? (
            <AccentButton
              className="w-full"
              onClick={() => setField("walletAddress", "0x1234...5678")}
            >
              Connect Wallet (Demo)
            </AccentButton>
          ) : (
            <div className="rounded border border-accent px-4 py-3 text-accent mb-2 text-center font-mono text-sm">
              {walletAddress}
            </div>
          )}
          <AccentButton
            className="w-full"
            disabled={!walletAddress}
            onClick={() => setStep(4)}
          >
            Mint &amp; Fund
          </AccentButton>
          <AccentButton
            secondary
            className="w-full"
            onClick={() => setStep(2)}
          >
            ← Back
          </AccentButton>
        </div>
      </div>
      {/* Expense Modal */}
      <AddExpenseModal
        open={expenseModalOpen}
        defaultExpense={
          editingExpenseIdx !== null ? expenses[editingExpenseIdx] : undefined
        }
        onClose={() => setExpenseModalOpen(false)}
        onSave={exp => {
          saveExpense({ ...exp, isFixed: true }, editingExpenseIdx);
          setExpenseModalOpen(false);
        }}
      />
    </div>
  );
};
