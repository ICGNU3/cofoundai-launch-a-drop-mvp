
import React from "react";

interface MintingStatusCardProps {
  status: string;
  isMinting: boolean;
  isPollingBalance: boolean;
}

export const MintingStatusCard: React.FC<MintingStatusCardProps> = ({
  status,
  isMinting,
  isPollingBalance,
}) => {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="text-center">
        <div className="text-lg font-semibold text-body-text mb-2">
          {status}
        </div>
        {(isMinting || isPollingBalance) && (
          <div className="w-full bg-background rounded-full h-2">
            <div className="bg-accent h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
          </div>
        )}
        {isPollingBalance && (
          <div className="text-sm text-yellow-500 mt-2">
            Checking USDCx balance...
          </div>
        )}
      </div>
    </div>
  );
};
