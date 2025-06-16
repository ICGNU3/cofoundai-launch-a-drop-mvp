
export type MintingStepKey =
  | "wallet-connection"
  | "wallet-sign"
  | "gas-selection"
  | "sending-transaction"
  | "txn-pending"
  | "generating-cover"
  | "minting-token"
  | "finalizing"
  | "complete"
  | "error";

export const stepLabels: Record<MintingStepKey, string> = {
  "wallet-connection": "Connecting to Wallet...",
  "wallet-sign": "Awaiting Wallet Confirmation...",
  "gas-selection": "Estimate Gas Fees",
  "sending-transaction": "Sending Transaction to Blockchain...",
  "txn-pending": "Transaction Pending Confirmation...",
  "generating-cover": "Generating Cover Art...",
  "minting-token": "Minting Zora Coin...",
  "finalizing": "Finalizing Drop...",
  "complete": "Completed!",
  "error": "Minting Failed",
};

export interface MintingWorkflowModalProps {
  open: boolean;
  onClose: () => void;
  projectIdea: string;
  roles: any[];
  expenses: any[];
  coverBase64?: string | null;
  onStartMint: (opts: { gasSpeed: "slow"|"standard"|"fast" }) => Promise<{ txHash?: string; step?: MintingStepKey; error?: string }>;
  walletConnected: boolean;
  walletAddress: string | null;
  estNetwork: string;
  chainId: number;
}

export interface ErrorInfo {
  message: string;
  code?: string;
  txHash?: string;
  isUserRejection?: boolean;
}
