import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Wand2, Share } from "lucide-react";
import type { Role, Expense, ProjectType } from "@/hooks/useWizardState";
import { useProjectById } from "@/hooks/useProjectById";
import { useToast } from "@/hooks/use-toast";
import { Wizard4MintingOverlaySection } from "./wizard4success/Wizard4MintingOverlaySection";
import { Wizard4SummarySection } from "./wizard4success/Wizard4SummarySection";
import { Wizard4AIContentSection } from "./wizard4success/Wizard4AIContentSection";
import { MintingWorkflowModal } from "./MintingWorkflowModal";
import Confetti from "react-confetti";
import { useMintingWorkflow } from "./hooks/useMintingWorkflow";

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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("summary");
  const [generatedContent, setGeneratedContent] = useState<any>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Calculate values
  const expenseSum = expenses.reduce((sum, exp) => sum + exp.amountUSDC, 0);
  const pledgeNum = Number(pledgeUSDC) || 0;
  const fundingTarget = expenseSum + pledgeNum;

  // Minting workflow extracted
  const [completedProjectRow, setCompletedProjectRow] = useState<any>(null);

  const {
    mintModalOpen,
    setMintModalOpen,
    handleMintAndFund,
    handleMintFlow,
    isMinting,
    currentStep,
    mintingStatus,
    progress,
    mintingSteps,
    coverIpfs,
    projectId,
    loadingMint,
    usdcxBalanceConfirmed,
    isPollingBalance,
    setProjectId,
  } = useMintingWorkflow({
    coverBase64,
    projectIdea,
    projectType,
    roles,
    expenses,
    pledgeUSDC,
    walletAddress,
    expenseSum,
    fundingTarget,
    onSaveComplete: (projectRow: any) => {
      setCompletedProjectRow(projectRow);
    },
  });

  // Get project from DB after mint
  const { data: projectRow, isLoading: isProjectLoading } = useProjectById(projectId);

  // Redirect after mint if project is not complete
  useEffect(() => {
    if (projectRow && projectRow.status !== "complete" && projectRow.id) {
      navigate(`/project/${projectRow.id}/dashboard`);
    }
  }, [projectRow, navigate]);

  // Show confetti if complete
  useEffect(() => {
    if (projectId && currentStep === "complete") {
      setShowConfetti(true);
      const timeout = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timeout);
    } else {
      setShowConfetti(false);
    }
  }, [projectId, currentStep]);

  // NEW: Redirect to Project Launch Hub after minting is complete
  useEffect(() => {
    if (projectRow && currentStep === "complete" && projectRow.id) {
      // Remove delay: go directly to launch hub!
      navigate(`/project/${projectRow.id}/launch`);
    }
  }, [projectRow, currentStep, navigate]);

  // Share button handler
  const handleShareDrop = () => {
    if (!projectId) return;
    const url = `${window.location.origin}/project/${projectId}/dashboard`;
    navigator.clipboard.writeText(url)
      .then(() => {
        toast({
          title: "Drop link copied!",
          description: "Share your drop’s dashboard with collaborators.",
        });
      })
      .catch(() => {
        toast({
          title: "Oops!",
          description: "Couldn’t copy the link. Please try again.",
          variant: "destructive",
        });
      });
  };

  // Loading UI
  if (isProjectLoading || (projectId && !projectRow)) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-body-text/80">Loading drop details...</span>
      </div>
    );
  }

  const isMinted = projectRow?.status === "minted";

  return (
    <div className="space-y-6 relative" ref={containerRef}>
      {/* Confetti celebration */}
      {showConfetti && (
        <Confetti
          width={typeof window !== "undefined" ? window.innerWidth : 600}
          height={typeof window !== "undefined" ? window.innerHeight : 400}
          numberOfPieces={220}
          recycle={false}
          gravity={0.24}
        />
      )}

      <Wizard4MintingOverlaySection
        isMinting={isMinting}
        mintingStatus={mintingStatus}
        currentStep={currentStep}
        progress={progress}
        mintingSteps={mintingSteps}
      />

      {/* Mint/Fund Modal */}
      <MintingWorkflowModal
        open={mintModalOpen}
        onClose={() => setMintModalOpen(false)}
        projectIdea={projectIdea}
        roles={roles}
        expenses={expenses}
        coverBase64={coverBase64}
        onStartMint={handleMintFlow}
        walletConnected={!!walletAddress}
        walletAddress={walletAddress}
        estNetwork="Zora"
        chainId={84532}
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
          <Wizard4SummarySection
            coverBase64={coverBase64}
            coverIpfs={coverIpfs}
            projectIdea={projectIdea}
            projectType={projectType}
            roles={roles}
            expenses={expenses}
            expenseSum={expenseSum}
            fundingTarget={fundingTarget}
            isMinted={isMinted}
            projectRow={projectRow}
            projectId={projectId}
            currentStep={currentStep}
            handleShareDrop={handleShareDrop}
            mintingStatus={mintingStatus}
            isMinting={isMinting}
            isPollingBalance={isPollingBalance}
            walletAddress={walletAddress}
            loadingMint={loadingMint}
            usdcxBalanceConfirmed={usdcxBalanceConfirmed}
            onMintAndFund={handleMintAndFund}
            onRestart={onRestart}
          />
        </TabsContent>

        <TabsContent value="ai-content" className="space-y-6">
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
