
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface WalletConnectionWarningProps {
  walletAddress: string | null;
}

export const WalletConnectionWarning: React.FC<WalletConnectionWarningProps> = ({
  walletAddress,
}) => {
  if (walletAddress) return null;

  return (
    <Card className="bg-red-50 border-red-200">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-red-700 font-medium">
              Wallet connection required
            </p>
            <p className="text-xs text-red-600 mt-1">
              Please connect your wallet in the top navigation to proceed with project creation.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
