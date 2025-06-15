
import React, { useState } from "react";
import { AccentButton } from "./ui/AccentButton";
import { ExpensePill } from "./ui/ExpensePill";
import { AddExpenseModal } from "./ui/AddExpenseModal";

// Types from parent
type Expense = {
  expenseName: string;
  vendorWallet: string;
  amountUSDC: number;
  isFixed: true;
  payoutType: "immediate" | "uponOutcome";
};
type Role = {
  roleName: string;
  walletAddress: string;
  percent: number;
  isFixed: false;
};

interface WizardExpensesStepProps {
  upfrontExpenses: Expense[];
  uponOutcomeExpenses: Expense[];
  expenseSum: number;
  outcomeSum: number;
  pledgeNum: number;
  totalNeeded: number;
  state: any;
  setField: (k: string, v: any) => void;
  saveExpense: (e: Expense, idx: number | null) => void;
  removeExpense: (idx: number) => void;
  setStep: (n: 1 | 2 | 3) => void;
  pinataJwt: string;
  setPinataJwt: (jwt: string) => void;
  children: React.ReactNode;
}

export const WizardExpensesStep: React.FC<WizardExpensesStepProps> = ({
  upfrontExpenses,
  uponOutcomeExpenses,
  expenseSum,
  outcomeSum,
  pledgeNum,
  state,
  setField,
  saveExpense,
  removeExpense,
  setStep,
  pinataJwt,
  setPinataJwt,
  children,
}) => {
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);

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
          >
            + Add Expense
          </button>
        </div>
        <div className="text-body-text text-sm opacity-80 mb-2">
          <span className="font-semibold text-accent">{upfrontExpenses.length} Up Front</span> &middot;{" "}
          <span className="font-semibold text-yellow-500">{uponOutcomeExpenses.length} Upon Outcome</span>
        </div>
        <div className="text-body-text text-sm opacity-80 mb-2">
          Up front expenses: <span className="font-semibold text-accent">${expenseSum.toFixed(2)}</span>
          <br />
          Upon outcome: <span className="font-semibold text-yellow-500">${outcomeSum.toFixed(2)}</span>
        </div>
        <div className="text-body-text text-sm opacity-80 mb-2">
          You need <span className="font-semibold text-accent">${expenseSum.toFixed(2)}</span> USDC +{" "}
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
          value={state.pledgeUSDC}
          onChange={e => setField("pledgeUSDC", e.target.value.replace(/^0+/, ""))}
          className="w-full mb-1"
        />
        {/* PINATA JWT input (for MVP/testing) */}
        <input
          type="password"
          className="w-full text-xs border border-yellow-500 bg-neutral-900 rounded px-3 py-2 mb-3"
          placeholder="Pinata JWT (Paste here for IPFS upload)"
          value={pinataJwt}
          onChange={e => setPinataJwt(e.target.value)}
        />
        {children}
      </div>
      {/* Expense Modal */}
      <AddExpenseModal
        open={expenseModalOpen}
        defaultExpense={
          state.editingExpenseIdx !== null ? state.expenses[state.editingExpenseIdx] : undefined
        }
        onClose={() => setExpenseModalOpen(false)}
        onSave={exp => {
          saveExpense({ ...exp, isFixed: true }, state.editingExpenseIdx);
          setExpenseModalOpen(false);
        }}
      />
    </div>
  );
};
