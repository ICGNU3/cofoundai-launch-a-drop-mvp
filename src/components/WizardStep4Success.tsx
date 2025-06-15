
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Role, Expense, ProjectType } from "@/hooks/useWizardState";
import { useMintingProcess } from "@/hooks/useMintingProcess";
import { useProjectSave } from "@/hooks/useProjectSave";
import { useUSDCxBalance } from "@/hooks/useUSDCxBalance";
import { MintingLoadingOverlay } from "./MintingLoadingOverlay";
import { MintingStatusCard } from "./MintingStatusCard";
import { ProjectSummaryCard } from "./ProjectSummaryCard";
import { ProjectPreviewCard } from "./ProjectPreviewCard";
import { ProjectActionButtons } from "./ProjectActionButtons";

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
  const navigate = useNavigate();
  const [projectId, setProjectId] = useState<string | null>(null);

  const { isMinting, mintingStatus, simulateMinting, completeMinting } = useMintingProcess();
  const { usdcxBalanceConfirmed, isPollingBalance, pollUSDCxBalance } = useUSDCxBalance();
  const saveProjectMutation = useProjectSave();

  // Calculate values
  const expenseSum = expenses.reduce((sum, exp) => sum + exp.amountUSDC, 0);
  const pledgeNum = Number(pledgeUSDC) || 0;
  const fundingTarget = expenseSum + pledgeNum;

  const handleMintAndFund = async () => {
    if (!walletAddress) return;

    try {
      const mintData = await simulateMinting();
      
      const project = await saveProjectMutation.mutateAsync({
        projectIdea,
        projectType,
        roles,
        expenses,
        pledgeUSDC,
        walletAddress,
        fundingTarget,
        expenseSum,
        ...mintData,
      });

      setProjectId(project.id);
      sessionStorage.setItem('autoNavigateToProject', project.id);
      
      completeMinting();
      pollUSDCxBalance();

    } catch (error) {
      console.error("Mint and fund error:", error);
    }
  };

  // Auto-navigate to project dashboard when available
  useEffect(() => {
    if (projectId && !isMinting && mintingStatus.includes("successfully")) {
      const timer = setTimeout(() => {
        navigate(`/project/${projectId}/dashboard`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [projectId, isMinting, mintingStatus, navigate]);

  return (
    <div className="space-y-6 relative">
      <MintingLoadingOverlay isVisible={isMinting} status={mintingStatus} />

      <ProjectSummaryCard
        projectIdea={projectIdea}
        projectType={projectType}
        rolesCount={roles.length}
        expenseSum={expenseSum}
        fundingTarget={fundingTarget}
      />

      <MintingStatusCard
        status={mintingStatus}
        isMinting={isMinting}
        isPollingBalance={isPollingBalance}
      />

      <ProjectPreviewCard roles={roles} expenses={expenses} />

      <ProjectActionButtons
        projectId={projectId}
        walletAddress={walletAddress}
        isMinting={isMinting}
        usdcxBalanceConfirmed={usdcxBalanceConfirmed}
        onMintAndFund={handleMintAndFund}
        onRestart={onRestart}
      />
    </div>
  );
};
