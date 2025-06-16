import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Wand2 } from "lucide-react";
import type { Role, Expense, ProjectType } from "@/hooks/useWizardState";
import { Wizard4MintingOverlaySection } from "./wizard4success/Wizard4MintingOverlaySection";
import { Wizard4SummarySection } from "./wizard4success/Wizard4SummarySection";
import { Wizard4AIContentSection } from "./wizard4success/Wizard4AIContentSection";
import { MintingWorkflowModal } from "./MintingWorkflowModal";
import { Wizard4ConfettiCelebration } from "./wizard4success/Wizard4ConfettiCelebration";
import { Wizard4DefaultTokenNotice } from "./wizard4success/Wizard4DefaultTokenNotice";
import { useWizardStep4State } from "./hooks/useWizardStep4State";

// --- TokenCustomization type for prop typing ---
type TokenCustomization = {
  name: string;
  symbol: string;
  tokenType: "erc20" | "erc721";
  totalSupply: number;
  mintingType: "fixed" | "inflation" | "deflation";
  inflationRate: number;
  deflationRate: number;
  distribution: { team: number; treasury: number; publicSale: number };
  vesting: { team: number; early: number };
  utility: {
    governance: boolean;
    access: boolean;
    staking: boolean;
    custom: string;
  };
};

interface WizardStep4SuccessProps {
  projectIdea: string;
  projectType: ProjectType;
  roles: Role[];
  expenses: Expense[];
  pledgeUSDC: string;
  walletAddress: string | null;
  onRestart: () => void;
  coverBase64?: string | null;
  tokenCustomization?: TokenCustomization;
}

export const WizardStep4Success: React.FC<WizardStep4SuccessProps> = ({
  projectIdea,
  projectType,
  roles,
  expenses,
  pledgeUSDC,
  walletAddress,
  onRestart,
  coverBase64,
  tokenCustomization,
}) => {
  const {
    activeTab,
    setActiveTab,
    generatedContent,
    setGeneratedContent,
    showConfetti,
    containerRef,
    expenseSum,
    fundingTarget,
    projectRow,
    isProjectLoading,
    handleShareDrop,
    isDefaultToken,
    isMinted,
    mintingWorkflow,
  } = useWizardStep4State({
    coverBase64,
    projectIdea,
    projectType,
    roles,
    expenses,
    pledgeUSDC,
    walletAddress,
    tokenCustomization,
  });

  // Loading UI
  if (isProjectLoading || (mintingWorkflow.projectId && !projectRow)) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-body-text/80">Loading drop details...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative" ref={containerRef}>
      {/* Confetti celebration */}
      <Wizard4ConfettiCelebration show={showConfetti} />

      <Wizard4MintingOverlaySection
        isMinting={mintingWorkflow.isMinting}
        mintingStatus={mintingWorkflow.mintingStatus}
        currentStep={mintingWorkflow.currentStep}
        progress={mintingWorkflow.progress}
        mintingSteps={mintingWorkflow.mintingSteps}
      />

      {/* Mint/Fund Modal */}
      <MintingWorkflowModal
        open={mintingWorkflow.mintModalOpen}
        onClose={() => mintingWorkflow.setMintModalOpen(false)}
        projectIdea={projectIdea}
        roles={roles}
        expenses={expenses}
        coverBase64={coverBase64}
        onStartMint={mintingWorkflow.handleMintFlow}
        walletConnected={!!walletAddress}
        walletAddress={walletAddress}
        estNetwork="Zora"
        chainId={84532}
      />

      {/* Message for default token */}
      {isDefaultToken && <Wizard4DefaultTokenNotice />}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <Sparkles size={16} />
            Project Summary
          </TabsTrigger>
          <TabsTrigger value="ai-content" className="flex items-center gap-2">
            <Wand2 size={16} />
            Content Suite
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-6">
          <Wizard4SummarySection
            coverBase64={coverBase64}
            coverIpfs={mintingWorkflow.coverIpfs}
            projectIdea={projectIdea}
            projectType={projectType}
            roles={roles}
            expenses={expenses}
            expenseSum={expenseSum}
            fundingTarget={fundingTarget}
            isMinted={isMinted}
            projectRow={projectRow}
            projectId={mintingWorkflow.projectId}
            currentStep={mintingWorkflow.currentStep}
            handleShareDrop={handleShareDrop}
            mintingStatus={mintingWorkflow.mintingStatus}
            isMinting={mintingWorkflow.isMinting}
            isPollingBalance={mintingWorkflow.isPollingBalance}
            walletAddress={walletAddress}
            loadingMint={mintingWorkflow.loadingMint}
            usdcxBalanceConfirmed={mintingWorkflow.usdcxBalanceConfirmed}
            onMintAndFund={mintingWorkflow.handleMintAndFund}
            onRestart={onRestart}
          />
        </TabsContent>

        <TabsContent value="ai-content" className="space-y-6">
          <div className="text-center space-y-2 mb-6">
            <h3 className="text-xl font-bold">Content Suite</h3>
            <p className="text-body-text/70">
              Upload your marketing assets and copy for your drop here.
            </p>
          </div>
          <Wizard4AIContentSection
            projectIdea={projectIdea}
            projectType={projectType}
            onContentGenerated={setGeneratedContent}
            setActiveTab={setActiveTab}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
