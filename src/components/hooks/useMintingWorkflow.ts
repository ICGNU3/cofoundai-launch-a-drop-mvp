
import { useMintingProcess } from "@/hooks/useMintingProcess";
import { useUSDCxBalance } from "@/hooks/useUSDCxBalance";
import { getCoinHelperText } from "@/lib/zoraCoin";
import { useMintingState } from "./useMintingState";
import { useMintingActions } from "./useMintingActions";

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
  const state = useMintingState();
  const { isMinting, currentStep, mintingStatus, progress, mintingSteps } = useMintingProcess();
  const { usdcxBalanceConfirmed, isPollingBalance, pollUSDCxBalance } = useUSDCxBalance();

  const { handleMintFlow } = useMintingActions({
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
    setCoverIpfs: state.setCoverIpfs,
    setProjectId: state.setProjectId,
    setLoadingMint: state.setLoadingMint,
    setPoolAddress: state.setPoolAddress,
    setLastError: state.setLastError,
  });

  const handleMintAndFund = async () => {
    state.setMintModalOpen(true);
  };

  return {
    mintModalOpen: state.mintModalOpen,
    setMintModalOpen: state.setMintModalOpen,
    handleMintAndFund,
    handleMintFlow,
    isMinting,
    currentStep,
    mintingStatus,
    progress,
    mintingSteps,
    coverIpfs: state.coverIpfs,
    projectId: state.projectId,
    loadingMint: state.loadingMint,
    usdcxBalanceConfirmed,
    isPollingBalance,
    setProjectId: state.setProjectId,
    lastError: state.lastError,
    poolAddress: state.poolAddress,
    helperText: getCoinHelperText(),
  };
}
