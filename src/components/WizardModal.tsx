import React, { useState } from "react";
import { useWizardState } from "@/hooks/useWizardState";
import { AccentButton } from "./ui/AccentButton";
import { RolePill } from "./ui/RolePill";
import { AddRoleModal } from "./ui/AddRoleModal";
import { ExpensePill } from "./ui/ExpensePill";
import { AddExpenseModal } from "./ui/AddExpenseModal";
import { PercentBar } from "./ui/PercentBar";
import { WizardRolesStep } from "./WizardRolesStep";

const projectTypes = ["Music", "Film", "Fashion", "Art", "Other"] as const;

export const WizardModal: React.FC<{
  state: ReturnType<typeof useWizardState>["state"];
  setField: ReturnType<typeof useWizardState>["setField"];
  setStep: (s: 1 | 2 | 3 | 4) => void;
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
    percentMsg = `Need ${100 - sumPercent} % allocated`;
  else if (sumPercent > 100)
    percentMsg = `Remove ${sumPercent - 100} % (over-allocated)`;
  else percentMsg = "Cuts balanced ✓";
  percentColor = sumPercent === 100 ? "text-green-400" : "text-red-500";
  const disableStep2Next = sumPercent !== 100;

  // Expense/calculation
  const upfrontExpenses = state.expenses.filter(e => e.payoutType === "immediate");
  const uponOutcomeExpenses = state.expenses.filter(e => e.payoutType === "uponOutcome");
  const expenseSum = upfrontExpenses.reduce((sum, x) => sum + x.amountUSDC, 0);
  const outcomeSum = uponOutcomeExpenses.reduce((sum, x) => sum + x.amountUSDC, 0);
  const pledgeNum = Number(state.pledgeUSDC) || 0;
  const totalNeeded = expenseSum + pledgeNum;

  // Success state logic
  const isSuccessStep = state.step === 4;

  // Handler for "Start New Drop"
  const handleStartNewDrop = () => {
    setField("projectIdea", "");
    setField("roles", []);
    setField("expenses", []);
    setField("pledgeUSDC", "");
    setField("walletAddress", null);
    setField("projectType", "Music");
    setField("step", 1);
    close();
  };

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
          {[1, 2, 3, 4].map(n => (
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
          <WizardRolesStep
            roles={state.roles}
            editingRoleIdx={state.editingRoleIdx}
            projectType={state.projectType}
            setField={setField}
            loadDefaultRoles={loadDefaultRoles}
            saveRole={saveRole}
            removeRole={removeRole}
            setStep={setStep}
          />
        )}
        {/* Step 3 */}
        {state.step === 3 && (
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
                state.editingExpenseIdx !== null ? state.expenses[state.editingExpenseIdx] : undefined
              }
              onClose={() => setExpenseModalOpen(false)}
              onSave={exp => {
                // Use exp.payoutType from modal. Always set isFixed: true.
                saveExpense({ ...exp, isFixed: true }, state.editingExpenseIdx);
                setExpenseModalOpen(false);
              }}
            />
          </div>
        )}
        {/* Step 4: SUCCESS */}
        {isSuccessStep && (
          <div className="flex flex-col items-center text-center p-8">
            <div className="text-green-400 text-4xl mb-3">✓</div>
            <h2 className="headline mb-2">Project Launched!</h2>
            <div className="text-body-text font-medium mb-6">
              Your drop is created. Here’s a quick summary:
            </div>
            <div className="w-full max-w-md mx-auto rounded-xl border border-border p-4 bg-[#191919] flex flex-col gap-2 mb-6">
              <div>
                <div className="font-semibold text-accent">Project Idea:</div>
                <div className="mb-2">{state.projectIdea || <span className="opacity-70">No idea entered</span>}</div>
              </div>
              <div>
                <div className="font-semibold text-accent">Project Type:</div>
                <div className="mb-2">{state.projectType}</div>
              </div>
              <div>
                <div className="font-semibold text-accent">Crew:</div>
                <div className="flex flex-wrap gap-1 mt-1 mb-2">
                  {state.roles.length === 0 ? (
                    <span className="opacity-60">No roles</span>
                  ) : (
                    state.roles.map((role, i) => (
                      <span key={i} className="inline-flex items-center rounded px-2 py-1 text-xs bg-accent/10 border border-accent text-accent mr-1">
                        {role.roleName} ({role.percent}%)
                      </span>
                    ))
                  )}
                </div>
              </div>
              <div>
                <div className="font-semibold text-accent">Expenses:</div>
                <div className="flex flex-wrap gap-1 mt-1 mb-2">
                  {state.expenses.length === 0 ? (
                    <span className="opacity-60">None</span>
                  ) : (
                    state.expenses.map((exp, i) => (
                      <span key={i} className="inline-flex items-center rounded px-2 py-1 text-xs bg-yellow-800/20 border border-yellow-600 text-yellow-400 mr-1">
                        {exp.expenseName} (${exp.amountUSDC})
                      </span>
                    ))
                  )}
                </div>
              </div>
              <div>
                <div className="font-semibold text-accent">Pledge:</div>
                <div className="mb-2">
                  {pledgeNum > 0 ? `$${pledgeNum}` : <span className="opacity-60">No pledge</span>}
                </div>
              </div>
              <div>
                <div className="font-semibold text-accent">Wallet:</div>
                <div className="mb-2">
                  {state.walletAddress || <span className="opacity-60">Not connected</span>}
                </div>
              </div>
            </div>
            <AccentButton 
              className="w-full max-w-xs"
              onClick={handleStartNewDrop}
            >
              Start New Drop
            </AccentButton>
          </div>
        )}
      </div>
    </div>
  );
};
