
import { useCallback } from "react";
import { useMintingProcess } from "@/hooks/useMintingProcess";
import { useUSDCxBalance } from "@/hooks/useUSDCxBalance";
import { getCoinHelperText } from "@/lib/zoraCoin";
import { useMintingState } from "./minting/useMintingState";
import { useMintingActions } from "./minting/useMintingActions";
import type { MintingWorkflowParams } from "./minting/types";

interface MintingWorkflowHookParams {
  coverBase64?: string | null;
  projectIdea: string;
  projectType: any;
  roles: any[];
  expenses: any[];
  pledgeUSDC: string;
  walletAddress: string | null;
  expenseSum: number;
  fundingTarget: number;
  onSaveComplete?: (projectRow: any) => void;
}

export function useMintingWorkflow(params: MintingWorkflowHookParams) {
  const { isMinting, currentStep, mintingStatus, progress, mintingSteps } = useMintingProcess();
  const { usdcxBalanceConfirmed, isPollingBalance, pollUSDCxBalance } = useUSDCxBalance();
  
  const mintingWorkflowParams: MintingWorkflowParams = {
    projectData: {
      projectIdea: params.projectIdea,
      projectType: params.projectType,
      mode: "team",
      roles: params.roles.map(role => ({
        name: role.roleName || role.name,
        percentage: role.percent || role.percentage,
        wallet: role.walletAddress
      })),
      expenses: params.expenses.map(expense => ({
        name: expense.expenseName || expense.name,
        amount: expense.amountUSDC || expense.amount
      })),
      pledgeUSDC: params.pledgeUSDC
    },
    walletAddress: params.walletAddress || "",
    coverBase64: params.coverBase64
  };
  
  const mintingState = useMintingState();
  const mintingActions = useMintingActions(mintingWorkflowParams, {
    setCoverIpfs: mintingState.setCoverIpfs,
    setProjectId: mintingState.setProjectId,
    setLoadingMint: mintingState.setLoadingMint,
    setPoolAddress: mintingState.setPoolAddress,
    setLastError: mintingState.setLastError,
  });

  const handleMintAndFund = useCallback(async () => {
    mintingState.setMintModalOpen(true);
  }, [mintingState]);

  return {
    // State
    coverIpfs: mintingState.coverIpfs,
    projectId: mintingState.projectId,
    loadingMint: mintingState.loadingMint,
    poolAddress: mintingState.poolAddress,
    mintModalOpen: mintingState.mintModalOpen,
    lastError: mintingState.lastError,
    
    // Process state
    isMinting,
    currentStep,
    mintingStatus,
    progress,
    mintingSteps,
    
    // Balance state
    usdcxBalanceConfirmed,
    isPollingBalance,
    
    // Actions
    handleMintAndFund,
    handleMintFlow: mintingActions.handleMintFlow,
    setMintModalOpen: mintingState.setMintModalOpen,
    setProjectId: mintingState.setProjectId,
    
    // Helper text
    helperText: getCoinHelperText(),
  };
}
