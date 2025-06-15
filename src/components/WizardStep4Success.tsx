import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Sparkles, Wand2, Share } from "lucide-react";
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
import Confetti from "react-confetti";
import { useToast } from "@/hooks/use-toast";
import { useProjectById } from "@/hooks/useProjectById";
import { Wizard4MintingOverlaySection } from "./wizard4success/Wizard4MintingOverlaySection";
import { Wizard4SummarySection } from "./wizard4success/Wizard4SummarySection";
import { Wizard4AIContentSection } from "./wizard4success/Wizard4AIContentSection";

interface WizardStep4SuccessProps {
  projectIdea: string;
  projectType: ProjectType;
  roles: Role[];
  expenses: Expense[];
  pledgeUSDC: string;
  walletAddress: string | null;
  onRestart: () => void;
  coverBase64?: string | null; // add prop to pass cover image
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
}) => {
  const navigate = useNavigate();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("summary");
  const [generatedContent, setGeneratedContent] = useState<any>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadingMint, setLoadingMint] = useState(false);
  const { toast } = useToast();

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

  // Keep track of latest cover IPFS
  const [coverIpfs, setCoverIpfs] = useState<string | null>(null);

  // Fetch project from DB after mint
  const { data: projectRow, isLoading: isProjectLoading } = useProjectById(projectId);

  // Mint handler: sets loading, disables button, and saves project in DB with status 'minted'
  const handleMintAndFund = async () => {
    if (!walletAddress) return;
    setLoadingMint(true);
    try {
      const tokenSymbol = "DROP";
      const mintData = await simulateMinting({ coverBase64, tokenSymbol });
      setCoverIpfs(mintData.ipfsHash);
      const project = await saveProjectMutation.mutateAsync({
        projectIdea,
        projectType,
        roles,
        expenses,
        pledgeUSDC,
        walletAddress,
        fundingTarget,
        expenseSum,
        tokenAddress: mintData.tokenAddress,
        txHash: mintData.txHash,
      });
      setProjectId(project.id);
      sessionStorage.setItem('autoNavigateToProject', project.id);

      completeMinting();
      pollUSDCxBalance();
    } catch (error) {
      console.error("Mint and fund error:", error);
    } finally {
      setLoadingMint(false);
    }
  };

  // Redirect if projectRow exists & status !== 'complete'
  useEffect(() => {
    if (projectRow && projectRow.status !== "complete" && projectRow.id) {
      // Always redirect to dashboard unless status=complete
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

  // Auto-navigate to project dashboard when minting is complete
  useEffect(() => {
    if (projectId && currentStep === "complete") {
      const timer = setTimeout(() => {
        navigate(`/project/${projectId}/dashboard`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [projectId, currentStep, navigate]);

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

  // Render loading or main UI
  if (isProjectLoading || (projectId && !projectRow)) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-body-text/80">Loading drop details...</span>
      </div>
    );
  }

  // If projectRow is minted, show collect link & pledge status
  const isMinted = projectRow?.status === "minted";

  return (
    <div className="space-y-6 relative" ref={containerRef}>
      {/* Confetti celebration effect */}
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
