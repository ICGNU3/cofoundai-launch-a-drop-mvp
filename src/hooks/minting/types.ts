
export interface MintingWorkflowParams {
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

export interface MintingErrorInfo {
  message: string;
  code?: string;
  txHash?: string;
}

export interface MintingState {
  coverIpfs: string | null;
  projectId: string | null;
  loadingMint: boolean;
  poolAddress: string | null;
  mintModalOpen: boolean;
  lastError: MintingErrorInfo | null;
}

export interface MintingFlowResult {
  txHash?: string;
  poolAddress?: string;
  step: "complete" | "error";
  error?: string;
  code?: string;
  isUserRejection?: boolean;
}
