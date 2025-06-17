
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StreamlinedWizardState } from "@/hooks/wizard/useStreamlinedWizard";

interface ProjectSummaryCardProps {
  state: StreamlinedWizardState;
}

export const ProjectSummaryCard: React.FC<ProjectSummaryCardProps> = ({ state }) => {
  const expenseSum = state.expenses.reduce((sum, exp) => sum + exp.amountUSDC, 0);
  const pledgeNum = Number(state.pledgeUSDC) || 0;
  const fundingTarget = expenseSum + pledgeNum;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Project Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-text/70">Project Type:</span>
          <span className="text-sm font-medium">{state.projectType}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-text/70">Mode:</span>
          <span className="text-sm font-medium">{state.mode}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-text/70">Team Members:</span>
          <span className="text-sm font-medium">{state.roles.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-text/70">Budget Items:</span>
          <span className="text-sm font-medium">{state.expenses.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-text/70">Initial Pledge:</span>
          <span className="text-sm font-medium">${state.pledgeUSDC || "0"} USDC</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-text/70">Funding Target:</span>
          <span className="text-sm font-medium">${fundingTarget.toLocaleString()} USDC</span>
        </div>
      </CardContent>
    </Card>
  );
};
