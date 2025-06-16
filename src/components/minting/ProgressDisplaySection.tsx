
import React from "react";
import { Loader } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { getExplorerUrl } from "./mintingWorkflowUtils";
import type { MintingStepKey } from "./mintingWorkflowTypes";

interface ProgressDisplaySectionProps {
  stage: MintingStepKey;
  stepLabel: string;
  progress: number;
  txHash: string | null;
  chainId: number;
}

export const ProgressDisplaySection: React.FC<ProgressDisplaySectionProps> = ({
  stage,
  stepLabel,
  progress,
  txHash,
  chainId,
}) => (
  <div>
    <div className="mb-2 text-center text-lg font-bold">{stepLabel}</div>
    <Progress value={progress} className="h-3 mb-4" />
    {txHash && (
      <div className="flex flex-col items-center mt-3">
        <span className="text-accent text-xs mb-2">Transaction Hash:</span>
        <a
          href={getExplorerUrl(chainId, txHash)}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all font-mono bg-background border rounded px-3 py-1 text-xs hover:bg-accent/10"
          tabIndex={0}
        >
          {txHash.slice(0, 10)}...{txHash.slice(-8)}
        </a>
      </div>
    )}
    <div className="text-sm text-body-text/60 mt-4">
      Please wait. This may take up to a minute, depending on network traffic.
    </div>
  </div>
);
