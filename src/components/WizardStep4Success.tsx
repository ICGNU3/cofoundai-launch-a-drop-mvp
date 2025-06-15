
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Sparkles, Wand2 } from "lucide-react";
import type { Role, Expense, ProjectType } from "@/hooks/useWizardState";
import { useMintingProcess } from "@/hooks/useMintingProcess";
import { useProjectSave } from "@/hooks/useProjectSave";
import { useUSDCxBalance } from "@/hooks/useUSDCxBalance";
import { MintingLoadingOverlay } from "./MintingLoadingOverlay";
import { MintingStatusCard } from "./MintingStatusCard";
import { ProjectSummaryCard } from "./ProjectSummaryCard";
import { ProjectPreviewCard } from "./ProjectPreviewCard";
import { ProjectActionButtons } from "./ProjectActionButtons";
import { AIContentGenerationHub } from "./AIContentGenerationHub";

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
  const [activeTab, setActiveTab] = useState("summary");
  const [generatedContent, setGeneratedContent] = useState<any>({});

  const { 
    isMinting, 
    currentStep, 
    mintingStatus, 
    progress, 
    mintingSteps, 
    simulateMinting, 
    completeMinting 
  } = useMintingProcess();
  
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
        // Include generated content
        generatedContent,
      });

      setProjectId(project.id);
      sessionStorage.setItem('autoNavigateToProject', project.id);
      
      completeMinting();
      pollUSDCxBalance();

    } catch (error) {
      console.error("Mint and fund error:", error);
    }
  };

  // Auto-navigate to project dashboard when minting is complete
  useEffect(() => {
    if (projectId && currentStep === "complete") {
      const timer = setTimeout(() => {
        navigate(`/project/${projectId}/dashboard`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [projectId, currentStep, navigate]);

  return (
    <div className="space-y-6 relative">
      <MintingLoadingOverlay 
        isVisible={isMinting} 
        status={mintingStatus}
        currentStep={currentStep}
        progress={progress}
        mintingSteps={mintingSteps}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <Sparkles size={16} />
            Project Summary
          </TabsTrigger>
          <TabsTrigger value="ai-content" className="flex items-center gap-2">
            <Wand2 size={16} />
            AI Content Suite
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6">
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
        </TabsContent>

        <TabsContent value="ai-content" className="space-y-6">
          <div className="text-center space-y-2 mb-6">
            <h3 className="text-xl font-bold">AI-Powered Content Generation</h3>
            <p className="text-body-text/70">
              Create professional marketing assets before launching your drop
            </p>
          </div>

          <AIContentGenerationHub
            projectIdea={projectIdea}
            projectType={projectType}
            onContentGenerated={setGeneratedContent}
          />

          <div className="flex justify-center mt-8">
            <Button
              onClick={() => setActiveTab("summary")}
              variant="outline"
            >
              ← Back to Summary
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
