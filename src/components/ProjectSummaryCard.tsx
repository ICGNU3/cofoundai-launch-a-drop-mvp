
import React from "react";
import type { ProjectType } from "@/hooks/useWizardState";

interface ProjectSummaryCardProps {
  projectIdea: string;
  projectType: ProjectType;
  rolesCount: number;
  expenseSum: number;
  fundingTarget: number;
}

export const ProjectSummaryCard: React.FC<ProjectSummaryCardProps> = ({
  projectIdea,
  projectType,
  rolesCount,
  expenseSum,
  fundingTarget,
}) => {
  return (
    <div className="text-center">
      <h2 className="headline mb-4">Ready to Launch! 🚀</h2>
      <div className="space-y-2 text-body-text">
        <div><strong>Project:</strong> {projectIdea}</div>
        <div><strong>Type:</strong> {projectType}</div>
        <div><strong>Roles:</strong> {rolesCount} team members</div>
        <div><strong>Expenses:</strong> ${expenseSum.toFixed(2)} USDC</div>
        <div><strong>Target Funding:</strong> ${fundingTarget.toFixed(2)} USDC</div>
      </div>
    </div>
  );
};
