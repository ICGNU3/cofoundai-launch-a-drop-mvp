
import React from "react";
import { Button } from "@/components/ui/button";
import { getExplorerUrl, getErrorSuggestion, supportResources } from "./mintingWorkflowUtils";
import type { ErrorInfo } from "./mintingWorkflowTypes";

interface ErrorDisplaySectionProps {
  errorInfo: ErrorInfo | null;
  chainId: number;
  onClose: () => void;
}

export const ErrorDisplaySection: React.FC<ErrorDisplaySectionProps> = ({
  errorInfo,
  chainId,
  onClose,
}) => (
  <div className="text-center py-8 space-y-4">
    <div className="text-red-400 mb-1 font-bold text-lg">
      Minting Failed
    </div>
    <div className="text-body-text/90 font-semibold">
      {errorInfo?.isUserRejection
        ? "Transaction Rejected"
        : errorInfo?.code === "INSUFFICIENT_FUNDS"
        ? "Insufficient Funds"
        : errorInfo?.code === "NETWORK"
        ? "Network Error"
        : errorInfo?.code === "GAS_ERROR"
        ? "Gas Fee Error"
        : errorInfo?.code === "CONTRACT"
        ? "Smart Contract Error"
        : "Unknown Error"}
    </div>
    <div className="text-body-text/70 leading-relaxed">
      {getErrorSuggestion(errorInfo?.code, errorInfo?.isUserRejection)}
    </div>
    <div className="my-2 text-xs text-body-text/60 break-words">
      <span className="font-medium">Reason:</span>{" "}
      {errorInfo?.message || "—"}
    </div>
    {errorInfo?.txHash && (
      <div className="flex flex-col items-center mt-2 w-full">
        <span className="text-accent text-xs mb-1">Transaction Hash:</span>
        <a
          href={getExplorerUrl(chainId, errorInfo.txHash)}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all font-mono bg-background border rounded px-3 py-1 text-xs hover:bg-accent/10"
          tabIndex={0}
        >
          {errorInfo.txHash.slice(0, 10)}...{errorInfo.txHash.slice(-8)}
        </a>
      </div>
    )}
    <div className="flex flex-col gap-2 items-center mt-4">
      <a
        href={supportResources.faqLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs underline text-muted-foreground hover:text-accent"
      >
        View our FAQ
      </a>
      <a
        href={supportResources.discordLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs underline text-muted-foreground hover:text-accent"
      >
        Ask for help in Discord
      </a>
      <a
        href={supportResources.contactLink}
        className="text-xs underline text-muted-foreground hover:text-accent"
        target="_blank"
        rel="noopener noreferrer"
      >
        Contact Support
      </a>
    </div>
    <Button onClick={onClose} className="mt-4">
      Dismiss
    </Button>
  </div>
);
