
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWizardState } from "@/hooks/useWizardState";
import { WizardStep1Describe } from "./WizardStep1Describe";
import { WizardBudgetStep } from "./WizardBudgetStep";
import { WizardStep3Expenses } from "./WizardStep3Expenses";
import { WizardStep4Success } from "./WizardStep4Success";

export const WizardModal: React.FC<{
  state: ReturnType<typeof useWizardState>["state"];
  setField: ReturnType<typeof useWizardState>["setField"];
  setStep: (s: 1 | 2 | 3 | 4) => void;
  close: () => void;
  saveRole: ReturnType<typeof useWizardState>["saveRole"];
  removeRole: ReturnType<typeof useWizardState>["removeRole"];
  updateRolePercent?: ReturnType<typeof useWizardState>["updateRolePercent"];
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
  updateRolePercent,
  saveExpense,
  removeExpense,
  loadDefaultRoles,
}) => {
  // For MVP, modal overlay and simple transitions only
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);

  // Percent validation
  const sumPercent = state.roles.reduce((sum, r) => sum + (r.percentNum || r.percent), 0);
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

  const slideVariants = {
    enter: { x: 300, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 }
  };

  return !state.isWizardOpen ? null : (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm transition"
    >
      <div className="wizard-card w-[95vw] max-w-card mx-auto relative shadow-lg">
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
            <motion.div
              key={n}
              className={`mx-1 w-6 h-2 rounded-full ${
                state.step === n 
                  ? "progress-bar"
                  : "bg-[#333]"
              }`}
              animate={{ 
                background: state.step === n 
                  ? "linear-gradient(90deg, #9A4DFF 0%, #5D5FEF 100%)" 
                  : "#333"
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
        
        {/* Steps with slide animations */}
        <AnimatePresence mode="wait">
          {state.step === 1 && (
            <motion.div
              key="step1"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <WizardStep1Describe
                projectIdea={state.projectIdea}
                setField={setField}
                onNext={() => setStep(2)}
              />
            </motion.div>
          )}
          {state.step === 2 && (
            <motion.div
              key="step2"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <WizardBudgetStep
                roles={state.roles}
                expenses={state.expenses}
                editingRoleIdx={state.editingRoleIdx}
                editingExpenseIdx={state.editingExpenseIdx}
                projectType={state.projectType}
                setField={setField}
                loadDefaultRoles={loadDefaultRoles}
                saveRole={saveRole}
                removeRole={removeRole}
                updateRolePercent={updateRolePercent}
                saveExpense={saveExpense}
                removeExpense={removeExpense}
                setStep={setStep}
              />
            </motion.div>
          )}
          {state.step === 3 && (
            <motion.div
              key="step3"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <WizardStep3Expenses
                expenses={state.expenses}
                editingExpenseIdx={state.editingExpenseIdx}
                setField={setField}
                saveExpense={saveExpense}
                removeExpense={removeExpense}
                pledgeUSDC={state.pledgeUSDC}
                walletAddress={state.walletAddress}
                setStep={setStep}
                roles={state.roles}
              />
            </motion.div>
          )}
          {state.step === 4 && (
            <motion.div
              key="step4"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <WizardStep4Success
                projectIdea={state.projectIdea}
                projectType={state.projectType}
                roles={state.roles}
                expenses={state.expenses}
                pledgeUSDC={state.pledgeUSDC}
                walletAddress={state.walletAddress}
                onRestart={handleStartNewDrop}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
