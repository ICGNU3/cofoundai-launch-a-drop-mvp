import React, { useState } from "react";
import { useWizardState } from "@/hooks/useWizardState";
import { AccentButton } from "./ui/AccentButton";
import { RolePill } from "./ui/RolePill";
import { AddRoleModal } from "./ui/AddRoleModal";
import { ExpensePill } from "./ui/ExpensePill";
import { AddExpenseModal } from "./ui/AddExpenseModal";

const projectTypes = ["Music", "Film", "Fashion", "Art", "Other"] as const;

export const WizardModal: React.FC<{
  state: ReturnType<typeof useWizardState>["state"];
  setField: ReturnType<typeof useWizardState>["setField"];
  setStep: (s: 1 | 2 | 3) => void;
  close: () => void;
  saveRole: ReturnType<typeof useWizardState>["saveRole"];
  removeRole: ReturnType<typeof useWizardState>["removeRole"];
  saveExpense: ReturnType<typeof useWizardState>["saveExpense"];
  removeExpense: ReturnType<typeof useWizardState>["removeExpense"];
  loadDefaultRoles: ReturnType<typeof useWizardState>["loadDefaultRoles"];
}> = ({
  state,
  setField,
  setStep,
  close,
  saveRole,
  removeRole,
  saveExpense,
  removeExpense,
  loadDefaultRoles,
}) => {
  // For MVP, modal overlay and simple transitions only
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);

  // Percent validation
  const sumPercent = state.roles.reduce((sum, r) => sum + r.percent, 0);
  let percentMsg = "";
  let percentColor = "";
  if (sumPercent < 100)
    percentMsg = `Need ${100 - sumPercent} %`;
  else if (sumPercent > 100)
    percentMsg = `Remove ${sumPercent - 100} %`;
  else percentMsg = "Cuts balanced ✓";
  percentColor = sumPercent === 100 ? "text-green-400" : "text-red-500";
  const disableStep2Next = sumPercent !== 100;

  // Expense/calculation
  const expenseSum = state.expenses.reduce((sum, x) => sum + x.amountUSDC, 0);
  const pledgeNum = Number(state.pledgeUSDC) || 0;
  const totalNeeded = expenseSum + pledgeNum;

  return !state.isWizardOpen ? null : (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm transition">
      <div className="wizard-card w-[95vw] max-w-card mx-auto relative animate-fade-in shadow-lg">
        <button
          className="absolute top-3 right-4 text-body-text opacity-70 hover:opacity-100"
          onClick={close}
          aria-label="Close"
        >
          ×
        </button>
        {/* Stepper */}
        <div className="flex justify-center mb-6">
          {[1, 2, 3].map(n => (
            <div
              key={n}
              className={`mx-1 w-6 h-2 rounded-full ${
                state.step === n 
                  ? "progress-bar"
                  : "bg-[#333]"
              }`}
            />
          ))}
        </div>
        {/* Step 1 */}
        {state.step === 1 && (
          <div>
            <h2 className="hero-title text-center">Describe Your Project Idea</h2>
            <textarea
              className="w-full mt-2 mb-7 min-h-[100px] resize-none"
              value={state.projectIdea}
              maxLength={256}
              onChange={e => setField("projectIdea", e.target.value)}
              placeholder="Three-track lo-fi EP…"
            />
            <AccentButton className="w-full mt-2" onClick={() => setStep(2)}>
              Next: Crew &amp; Cut →
            </AccentButton>
          </div>
        )}
        {/* Step 2 */}
        {state.step === 2 && (
          <div>
            <h2 className="headline text-center mb-2">Crew &amp; Cut</h2>
            <div className="flex flex-col gap-2">
              <label className="block mb-1 text-body-text font-semibold">
                Project Type
              </label>
              <select
                className="w-full mb-2"
                value={state.projectType}
                onChange={e => {
                  setField("projectType", e.target.value as typeof projectTypes[number]);
                  loadDefaultRoles(e.target.value as typeof projectTypes[number]);
                }}
              >
                {projectTypes.map(type => (
                  <option value={type} key={type}>{type}</option>
                ))}
              </select>
              {/* Role Pills */}
              <div className="mb-2 flex flex-wrap gap-2">
                {state.roles.map((role, i) => (
                  <RolePill
                    key={i}
                    role={role}
                    onEdit={() => {
                      setField("editingRoleIdx", i);
                      setRoleModalOpen(true);
                    }}
                    onDelete={() => removeRole(i)}
                  />
                ))}
                <button
                  className="role-pill bg-[#222] text-accent border-accent hover:bg-accent/10 ml-1"
                  onClick={() => {
                    setField("editingRoleIdx", null);
                    setRoleModalOpen(true);
                  }}
                  aria-label="Add Role"
                  type="button"
                >+ Add Role</button>
              </div>
              <div className={`text-sm font-semibold ${percentColor} mb-2`}>{percentMsg}</div>
              <div className="flex gap-2 mt-2">
                <AccentButton
                  secondary
                  className="w-1/2"
                  onClick={() => setStep(1)}
                >← Back</AccentButton>
                <AccentButton
                  className="w-1/2"
                  disabled={disableStep2Next}
                  onClick={() => setStep(3)}
                >Next: Expenses →</AccentButton>
              </div>
            </div>
            {/* AddRoleModal */}
            <AddRoleModal
              open={roleModalOpen}
              defaultRole={
                state.editingRoleIdx !== null ? state.roles[state.editingRoleIdx] : undefined
              }
              onClose={() => setRoleModalOpen(false)}
              onSave={role => {
                // Patch: ensure 'isFixed: false' added for Role typing
                saveRole({ ...role, isFixed: false }, state.editingRoleIdx);
                setRoleModalOpen(false);
              }}
              existingRoles={state.roles}
            />
          </div>
        )}
        {/* Step 3 */}
        {state.step === 3 && (
          <div>
            <h2 className="headline text-center mb-2">Expenses &amp; Funding</h2>
            <div>
              {/* Expense Pills */}
              <div className="mb-2 flex flex-wrap gap-2">
                {state.expenses.map((expense, i) => (
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
                Total expenses: <span className="font-semibold text-accent">${expenseSum.toFixed(2)}</span>
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
                value={state.pledgeUSDC}
                onChange={e => setField("pledgeUSDC", e.target.value.replace(/^0+/, ""))}
                className="w-full mb-1"
              />
              <div className="flex flex-col gap-3 mt-6">
                {/* Simulate Connect Wallet as button */}
                {!state.walletAddress ? (
                  <AccentButton
                    className="w-full"
                    onClick={() => setField("walletAddress", "0x1234...5678")}
                  >
                    Connect Wallet (Demo)
                  </AccentButton>
                ) : (
                  <div className="rounded border border-accent px-4 py-3 text-accent mb-2 text-center font-mono text-sm">
                    {state.walletAddress}
                  </div>
                )}
                <AccentButton
                  className="w-full"
                  disabled={!state.walletAddress}
                  onClick={() => {/* Automations next step coming soon */}}
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
                state.editingExpenseIdx !== null ? state.expenses[state.editingExpenseIdx] : undefined
              }
              onClose={() => setExpenseModalOpen(false)}
              onSave={exp => {
                saveExpense({...exp, isFixed: true}, state.editingExpenseIdx);
                setExpenseModalOpen(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
