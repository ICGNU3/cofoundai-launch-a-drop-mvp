
import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getExplorerUrl } from "./mintingWorkflowUtils";

interface CompletionDisplaySectionProps {
  txHash: string | null;
  chainId: number;
  onClose: () => void;
}

export const CompletionDisplaySection: React.FC<CompletionDisplaySectionProps> = ({
  txHash,
  chainId,
  onClose,
}) => (
  <div className="text-center py-7">
    <Check size={36} className="text-accent mb-3 mx-auto" />
    <div className="text-xl font-headline font-bold mb-1">Drop Launched!</div>
    {txHash && (
      <div>
        <span className="text-sm">Txn Hash:{" "}</span>
        <a
          href={getExplorerUrl(chainId, txHash)}
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-mono text-accent"
        >
          {txHash.slice(0, 10)}...{txHash.slice(-8)}
        </a>
      </div>
    )}
    <Button className="mt-5" onClick={onClose}>Done</Button>
  </div>
);
