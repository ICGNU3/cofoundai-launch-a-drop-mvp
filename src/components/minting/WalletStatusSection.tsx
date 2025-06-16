
import React from "react";
import { Check, Loader } from "lucide-react";

interface WalletStatusSectionProps {
  walletConnected: boolean;
  walletAddress: string | null;
}

export const WalletStatusSection: React.FC<WalletStatusSectionProps> = ({
  walletConnected,
  walletAddress,
}) => {
  if (walletConnected && walletAddress)
    return (
      <div className="py-3 text-success flex items-center gap-2 justify-center">
        <Check className="text-green-400" size={18} />
        Wallet Connected:{" "}
        <span className="ml-1 font-mono text-accent">{walletAddress}</span>
      </div>
    );
  
  return (
    <div className="py-2 flex items-center justify-center gap-2 text-orange-400">
      <Loader className="animate-spin" size={18} />
      Waiting for wallet connection...
    </div>
  );
};
