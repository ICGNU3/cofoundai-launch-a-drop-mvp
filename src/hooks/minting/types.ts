
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
}

export interface MintingResult {
  hash: string;
  coinAddress?: string;
}

export interface MintingError {
  message: string;
  code?: string | number;
}
