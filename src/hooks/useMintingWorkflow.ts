
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMintingProcess } from "@/hooks/useMintingProcess";
import { useUSDCxBalance } from "@/hooks/useUSDCxBalance";
import { useProjectSave } from "@/hooks/useProjectSave";
import { useUniversalSwap } from "@/hooks/useUniversalSwap";
import { deployCoinWithRoyalties } from "@/lib/zoraCoin";
import { getCoinHelperText } from "@/lib/zoraCoin";

interface MintingWorkflowParams {
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
}

export function useMintingWorkflow(params: MintingWorkflowParams) {
  const { toast } = useToast();
  const { isMinting, currentStep, mintingStatus, progress, mintingSteps, simulateMinting, completeMinting } = useMintingProcess();
  const { usdcxBalanceConfirmed, isPollingBalance, pollUSDCxBalance } = useUSDCxBalance();
  const { createPoolAndAddLiquidity } = useUniversalSwap();
  const saveProjectMutation = useProjectSave();

  // Consolidated state
  const [coverIpfs, setCoverIpfs] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [loadingMint, setLoadingMint] = useState(false);
  const [poolAddress, setPoolAddress] = useState<string | null>(null);
  const [mintModalOpen, setMintModalOpen] = useState(false);
  const [lastError, setLastError] = useState<{
    message: string;
    code?: string;
    txHash?: string;
  } | null>(null);

  const handleMintAndFund = useCallback(async () => {
    setMintModalOpen(true);
  }, []);

  const handleMintFlow = useCallback(async ({ gasSpeed }: { gasSpeed: "slow"|"standard"|"fast" }) => {
    setLoadingMint(true);
    
    try {
      const tokenSymbol = "NPLUS";
      const tokenName = "NEPLUS Coin";
      const tokenSupply = 1000000;
      
      console.log('Starting complete minting and funding flow...');
      
      // Step 1: Deploy coin with royalty hook
      const coinDeployment = await deployCoinWithRoyalties({
        name: tokenName,
        symbol: tokenSymbol,
        supply: tokenSupply,
        royaltyBps: 500, // 5% royalty
        creator: params.walletAddress || undefined
      });

      console.log('Coin deployed:', coinDeployment);

      // Step 2: Mint the token via Zora
      const mintData = await simulateMinting({
        coverBase64: params.coverBase64,
        tokenSymbol,
        tokenName,
        tokenSupply,
        userWallet: params.walletAddress,
      });
      
      setCoverIpfs(mintData.ipfsHash);
      
      // Step 3: Create Uniswap V4 pool with initial liquidity
      console.log('Creating Uniswap V4 pool...');
      const poolResult = await createPoolAndAddLiquidity({
        tokenA: mintData.tokenAddress,
        tokenB: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base
        fee: 3000, // 0.3% fee tier
        initialPrice: "1000000000000000000", // 1:1 initial price
        liquidityAmount: params.pledgeUSDC.toString()
      });

      setPoolAddress(poolResult?.poolAddress || null);
      console.log('Pool created:', poolResult);

      // Step 4: Save project with pool information
      const project = await saveProjectMutation.mutateAsync({
        projectIdea: params.projectIdea,
        projectType: params.projectType,
        roles: params.roles,
        expenses: params.expenses,
        pledgeUSDC: params.pledgeUSDC.toString(),
        walletAddress: params.walletAddress,
        fundingTarget: params.fundingTarget,
        expenseSum: params.expenseSum,
        tokenAddress: mintData.tokenAddress,
        txHash: mintData.txHash,
        poolAddress: poolResult?.poolAddress,
      });
      
      setProjectId(project.id);
      params.onSaveComplete(project);
      completeMinting();

      toast({
        title: "NEPLUS Coin Launched Successfully!",
        description: `Your coin is live with trading pool and ${coinDeployment.royaltyBps / 100}% creator royalties.`,
        variant: "default",
      });

      setLoadingMint(false);
      return { 
        txHash: mintData.txHash, 
        poolAddress: poolResult?.poolAddress,
        step: "complete" as const 
      };
      
    } catch (error: any) {
      setLoadingMint(false);

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
      
      if (error?.txHash) txHash = error.txHash;

      setLastError({
        message: errMsg,
        code,
        txHash,
      });

      console.error('[MINTING_ERROR_LOG]', {
        message: errMsg,
        code,
        txHash,
        date: new Date().toISOString(),
      });
      
      toast({
        title: "Launch Failed",
        description: "Failed to launch your coin and pool. Please try again.",
        variant: "destructive",
      });

      return { error: errMsg, code, txHash, step: "error" as const, isUserRejection };
    }
  }, [params, simulateMinting, createPoolAndAddLiquidity, saveProjectMutation, completeMinting, toast]);

  return {
    // State
    coverIpfs,
    projectId,
    loadingMint,
    poolAddress,
    mintModalOpen,
    lastError,
    
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
    handleMintFlow,
    setMintModalOpen,
    setProjectId,
    
    // Helper text
    helperText: getCoinHelperText(),
  };
}
