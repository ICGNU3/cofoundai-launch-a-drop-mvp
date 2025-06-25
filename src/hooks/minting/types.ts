
export interface MintingWorkflowParams {
  projectData?: {
    projectIdea: string;
    projectType: string;
    mode: string;
    roles: Array<{
      name: string;
      percentage: number;
      wallet?: string;
    }>;
    expenses: Array<{
      name: string;
      amount: number;
    }>;
    pledgeUSDC: string;
  };
  walletAddress: string;
  coverBase64?: string | null;
}

export interface MintingResult {
  hash: string;
  coinAddress?: string;
}

export interface MintingError {
  message: string;
  code?: string | number;
}

export interface MintingState {
  coverIpfs: string | null;
  projectId: string | null;
  loadingMint: boolean;
  poolAddress: string | null;
  mintModalOpen: boolean;
  lastError: string | null;
}

export type MintingErrorInfo = MintingError;
