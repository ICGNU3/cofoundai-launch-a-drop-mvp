
import { useCallback } from "react";
import { useMintingProcess } from "@/hooks/useMintingProcess";
import { useUSDCxBalance } from "@/hooks/useUSDCxBalance";
import { getCoinHelperText } from "@/lib/zoraCoin";
import { useMintingState } from "./minting/useMintingState";
import { useMintingActions } from "./minting/useMintingActions";
import type { MintingWorkflowParams } from "./minting/types";

export function useMintingWorkflow(params: MintingWorkflowParams) {
  const { isMinting, currentStep, mintingStatus, progress, mintingSteps } = useMintingProcess();
  const { usdcxBalanceConfirmed, isPollingBalance, pollUSDCxBalance } = useUSDCxBalance();
  
  const mintingState = useMintingState();
  const mintingActions = useMintingActions(params, {
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
