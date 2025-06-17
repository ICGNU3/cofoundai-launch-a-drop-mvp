
import React from "react";
import { AlertTriangle } from "lucide-react";

interface WalletConnectionWarningProps {
  walletAddress: string | null;
}

export const WalletConnectionWarning: React.FC<WalletConnectionWarningProps> = ({
  walletAddress,
}) => {
  if (walletAddress) return null;

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2 text-orange-800">
        <AlertTriangle className="w-4 h-4" />
        <span className="text-sm font-light font-inter tracking-wide">Wallet Connection Required</span>
      </div>
      <p className="text-sm text-orange-700 mt-1 font-light font-inter tracking-wide">
        Please connect your wallet to continue with project creation.
      </p>
    </div>
  );
};
