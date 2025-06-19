
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StreamlinedWizardState } from "@/hooks/wizard/useStreamlinedWizard";

interface ProjectSummaryProps {
  state: StreamlinedWizardState;
}

export const ProjectSummary: React.FC<ProjectSummaryProps> = ({ state }) => {
  const totalExpenses = state.expenses.reduce((sum, expense) => sum + expense.amountUSDC, 0);
  const pledgeAmount = parseInt(state.pledgeUSDC) || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Project Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-text/70">Project Type:</span>
            <span className="font-medium">{state.projectType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text/70">Mode:</span>
            <span className="font-medium capitalize">{state.mode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text/70">Team Members:</span>
            <span className="font-medium">{state.roles.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text/70">Budget Items:</span>
            <span className="font-medium">{state.expenses.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text/70">Total Budget:</span>
            <span className="font-medium">${totalExpenses.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text/70">Your Pledge:</span>
            <span className="font-medium">${pledgeAmount.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
