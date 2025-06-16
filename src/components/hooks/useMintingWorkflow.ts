import { useState } from "react";
import { useMintingProcess } from "@/hooks/useMintingProcess";
import { useUSDCxBalance } from "@/hooks/useUSDCxBalance";
import { useProjectSave } from "@/hooks/useProjectSave";
import { useToast } from "@/hooks/use-toast";
import { deployCoinWithRoyalties, getCoinHelperText } from "@/lib/zoraCoin";

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

  // Enhanced error state/logging
  const [lastError, setLastError] = useState<{
    message: string;
    code?: string;
    txHash?: string;
  } | null>(null);

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
      const tokenSymbol = "NPLUS";
      const tokenName = "NEPLUS Coin";
      const tokenSupply = 1000000;
      
      // Deploy coin with royalty hook
      const coinDeployment = await deployCoinWithRoyalties({
        name: tokenName,
        symbol: tokenSymbol,
        supply: tokenSupply,
        royaltyBps: 500, // 5% royalty
        creator: walletAddress || undefined
      });

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
        tokenAddress: coinDeployment.coinAddress,
        txHash: mintData.txHash,
      });
      setProjectId(project.id);
      onSaveComplete(project);
      completeMinting();
      pollUSDCxBalance();

      // SUCCESS TOAST with royalty info
      toast({
        title: "NEPLUS Coin Minted Successfully!",
        description: `Your coin is live with ${coinDeployment.royaltyBps / 100}% creator royalties.`,
        variant: "default",
      });

      setLoadingMint(false);
      return { txHash: mintData.txHash, step: "txn-pending" as const };
    } catch (error: any) {
      setLoadingMint(false);

      // Classify error:
      let code: string | undefined;
      let isUserRejection: boolean | undefined = false;
      let txHash: string | undefined = undefined;
      let errMsg = error?.message || "An error occurred";
      if (
        /user (denied|rejected)/i.test(errMsg) ||
        /rejected by user/i.test(errMsg)
      ) {
        code = "USER_REJECTED";
        isUserRejection = true;
      } else if (/insufficient/i.test(errMsg)) {
        code = "INSUFFICIENT_FUNDS";
      } else if (/gas/i.test(errMsg)) {
        code = "GAS_ERROR";
      } else if (/network/i.test(errMsg)) {
        code = "NETWORK";
      } else if (/contract|smart contract/i.test(errMsg)) {
        code = "CONTRACT";
      } else {
        code = "SYSTEM";
      }
      // Try to get txHash if it's on error object
      if (error?.txHash) txHash = error.txHash;

      setLastError({
        message: errMsg,
        code,
        txHash,
      });

      // Log error for analytics
      if (typeof window !== "undefined") {
        window.console?.error?.(
          "[MINTING_ERROR_LOG]",
          {
            message: errMsg,
            code,
            txHash,
            date: new Date().toISOString(),
          }
        );
      }
      // FAILURE TOAST
      toast({
        title: "Minting Failed",
        description: "Minting Failed. Please try again.",
        variant: "destructive",
      });

      return { error: errMsg, code, txHash, step: "error" as const, isUserRejection };
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
    lastError,
    helperText: getCoinHelperText(), // Add helper text for UI
  };
}
