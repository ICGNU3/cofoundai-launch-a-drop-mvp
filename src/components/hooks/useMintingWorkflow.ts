import { useState } from "react";
import { useMintingProcess } from "@/hooks/useMintingProcess";
import { useUSDCxBalance } from "@/hooks/useUSDCxBalance";
import { useProjectSave } from "@/hooks/useProjectSave";
import { useToast } from "@/hooks/use-toast";

// extracted from WizardStep4Success
export function useMintingWorkflow({
  coverBase64,
  projectIdea,
  projectType,
  roles,
  expenses,
  pledgeUSDC,
  walletAddress,
  expenseSum,
  fundingTarget,
  onSaveComplete,
}: {
  coverBase64?: string | null;
  projectIdea: string;
  projectType: any;
  roles: any[];
  expenses: any[];
  pledgeUSDC: string | number;
  walletAddress: string | null;
  expenseSum: number;
  fundingTarget: number;
  onSaveComplete: (projectRow: any) => void;
}) {
  const [coverIpfs, setCoverIpfs] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [loadingMint, setLoadingMint] = useState(false);

  const { toast } = useToast();
  const { isMinting, currentStep, mintingStatus, progress, mintingSteps, simulateMinting, completeMinting } = useMintingProcess();
  const { usdcxBalanceConfirmed, isPollingBalance, pollUSDCxBalance } = useUSDCxBalance();
  const saveProjectMutation = useProjectSave();

  // Modal controller (for useWizardStep4 and modal open/close)
  const [mintModalOpen, setMintModalOpen] = useState(false);

  // Modal-triggering handler
  const handleMintAndFund = async () => {
    setMintModalOpen(true);
  };

  // Main minting controller for modal
  const handleMintFlow = async ({ gasSpeed }: { gasSpeed: "slow"|"standard"|"fast" }) => {
    setLoadingMint(true);
    try {
      const tokenSymbol = "DROP";
      const tokenName = "Drop";
      const tokenSupply = 1000000;
      const mintData = await simulateMinting({
        coverBase64,
        tokenSymbol,
        tokenName,
        tokenSupply,
        userWallet: walletAddress,
      });
      setCoverIpfs(mintData.ipfsHash);
      const project = await saveProjectMutation.mutateAsync({
        projectIdea,
        projectType,
        roles,
        expenses,
        pledgeUSDC: pledgeUSDC.toString(), // Ensure string for type safety
        walletAddress,
        fundingTarget,
        expenseSum,
        tokenAddress: mintData.tokenAddress,
        txHash: mintData.txHash,
      });
      setProjectId(project.id);
      onSaveComplete(project);
      completeMinting();
      pollUSDCxBalance();
      setLoadingMint(false);
      return { txHash: mintData.txHash, step: "txn-pending" as const };
    } catch (error: any) {
      setLoadingMint(false);
      return { error: error?.message || "An error occurred", step: "error" as const };
    }
  };

  return {
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
  };
}
