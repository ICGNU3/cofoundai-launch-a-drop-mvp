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

  // Store projectId when created so we can query it later
  const [projectId, setProjectId] = useState<string | null>(null);

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
          {/* Show Cover Art (with IPFS link if available) */}
          {(coverBase64 || coverIpfs) && (
            <div className="w-full flex flex-col items-center">
              <label className="mb-1 text-sm text-body-text/60">Your Cover Art:</label>
              <a
                href={coverIpfs ? `https://ipfs.io/ipfs/${coverIpfs}` : undefined}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={0}
                aria-label="Open uploaded cover on IPFS"
                className="block rounded border-2 border-accent shadow-lg p-1 max-w-[240px] hover:scale-105 transition mb-2"
                style={{ pointerEvents: coverIpfs ? "auto" : "none", opacity: coverIpfs ? 1 : 0.7 }}
              >
                <img
                  src={coverBase64 || (coverIpfs ? `https://ipfs.io/ipfs/${coverIpfs}` : "")}
                  alt="Uploaded Cover Art"
                  className="rounded max-h-48 w-auto"
                />
              </a>
              {coverIpfs && (
                <small className="text-xs text-accent">
                  <a href={`https://ipfs.io/ipfs/${coverIpfs}`} target="_blank" rel="noopener noreferrer">
                    View on IPFS
                  </a>
                </small>
              )}
            </div>
          )}

          <ProjectSummaryCard
            projectIdea={projectIdea}
            projectType={projectType}
            rolesCount={roles.length}
            expenseSum={expenseSum}
            fundingTarget={fundingTarget}
          />

          {isMinted && (
            <div className="text-center my-4">
              <a
                href={projectRow?.token_address ? `https://zora.co/collect/${projectRow.token_address}` : "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded shadow hover:bg-primary/90"
                style={{ pointerEvents: projectRow?.token_address ? "auto" : "none", opacity: projectRow?.token_address ? 1 : 0.5 }}
              >
                Collect Drop
              </a>
              <div className="mt-2 text-sm">
                <span className="font-semibold text-accent">Pledge status:</span>{" "}
                <span>
                  {projectRow?.pledge_usdc && Number(projectRow.pledge_usdc) > 0
                    ? `Pledged ${projectRow.pledge_usdc} USDC`
                    : "No pledge"}
                </span>
              </div>
            </div>
          )}

          {/* Show Share button after successful launch */}
          {projectId && currentStep === "complete" && (
            <div className="flex justify-center">
              <Button
                className="gap-2 border transition-all hover:shadow-lg [&_svg]:shrink-0 bg-surface"
                variant="outline"
                onClick={handleShareDrop}
              >
                <Share size={18} />
                Share your Drop
              </Button>
            </div>
          )}

          <MintingStatusCard
            status={mintingStatus}
            isMinting={isMinting}
            isPollingBalance={isPollingBalance}
          />

          <ProjectPreviewCard roles={roles} expenses={expenses} />

          <ProjectActionButtons
            projectId={projectId}
            walletAddress={walletAddress}
            isMinting={isMinting || loadingMint}
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
