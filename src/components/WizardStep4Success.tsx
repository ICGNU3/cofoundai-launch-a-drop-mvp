
import React from "react";
import { AccentButton } from "./ui/AccentButton";
import type { Role, Expense, ProjectType } from "@/hooks/useWizardState";

interface WizardStep4SuccessProps {
  projectIdea: string;
  projectType: ProjectType;
  roles: Role[];
  expenses: Expense[];
  pledgeUSDC: string;
  walletAddress: string | null;
  onRestart: () => void;
}

export const WizardStep4Success: React.FC<WizardStep4SuccessProps> = ({
  projectIdea,
  projectType,
  roles,
  expenses,
  pledgeUSDC,
  walletAddress,
  onRestart,
}) => {
  const pledgeNum = Number(pledgeUSDC) || 0;
  return (
    <div className="flex flex-col items-center text-center p-8">
      <div className="text-green-400 text-4xl mb-3">✓</div>
      <h2 className="headline mb-2">Project Launched!</h2>
      <div className="text-body-text font-medium mb-6">
        Your drop is created. Here’s a quick summary:
      </div>
      <div className="w-full max-w-md mx-auto rounded-xl border border-border p-4 bg-[#191919] flex flex-col gap-2 mb-6">
        <div>
          <div className="font-semibold text-accent">Project Idea:</div>
          <div className="mb-2">{projectIdea || <span className="opacity-70">No idea entered</span>}</div>
        </div>
        <div>
          <div className="font-semibold text-accent">Project Type:</div>
          <div className="mb-2">{projectType}</div>
        </div>
        <div>
          <div className="font-semibold text-accent">Crew:</div>
          <div className="flex flex-wrap gap-1 mt-1 mb-2">
            {roles.length === 0 ? (
              <span className="opacity-60">No roles</span>
            ) : (
              roles.map((role, i) => (
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
            {expenses.length === 0 ? (
              <span className="opacity-60">None</span>
            ) : (
              expenses.map((exp, i) => (
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
            {walletAddress || <span className="opacity-60">Not connected</span>}
          </div>
        </div>
      </div>
      <AccentButton 
        className="w-full max-w-xs"
        onClick={onRestart}
      >
        Start New Drop
      </AccentButton>
    </div>
  );
};
