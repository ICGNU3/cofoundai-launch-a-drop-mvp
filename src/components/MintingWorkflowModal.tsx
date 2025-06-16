
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGasEstimator } from "./hooks/useGasEstimator";
import { DropSummarySection } from "./minting/DropSummarySection";
import { WalletStatusSection } from "./minting/WalletStatusSection";
import { GasOptionsSection } from "./minting/GasOptionsSection";
import { ErrorDisplaySection } from "./minting/ErrorDisplaySection";
import { ProgressDisplaySection } from "./minting/ProgressDisplaySection";
import { CompletionDisplaySection } from "./minting/CompletionDisplaySection";
import { identifyErrorType } from "./minting/mintingWorkflowUtils";
import type { MintingStepKey, MintingWorkflowModalProps, ErrorInfo, stepLabels } from "./minting/mintingWorkflowTypes";

export type { MintingStepKey } from "./minting/mintingWorkflowTypes";

export const MintingWorkflowModal: React.FC<MintingWorkflowModalProps> = ({
  open,
  onClose,
  projectIdea,
  roles,
  expenses,
  coverBase64,
  onStartMint,
  walletConnected,
  walletAddress,
  estNetwork,
  chainId,
}) => {
  const [stage, setStage] = useState<MintingStepKey>("wallet-connection");
  const [gasSpeed, setGasSpeed] = useState<"slow"|"standard"|"fast">("standard");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null);

  const { gasFees, loading: gasLoading } = useGasEstimator(chainId);

  useEffect(() => {
    if (!open) {
      setStage("wallet-connection");
      setTxHash(null);
      setProgress(0);
      setGasSpeed("standard");
      setErrorInfo(null);
    }
  }, [open]);

  // Wallet state and connection detection
  useEffect(() => {
    if (stage === "wallet-connection" && walletConnected) {
      setStage("gas-selection");
    }
  }, [walletConnected, stage]);

  // Handle step progress
  useEffect(() => {
    if (stage === "sending-transaction") setProgress(35);
    if (stage === "txn-pending") setProgress(65);
    if (stage === "generating-cover") setProgress(80);
    if (stage === "minting-token") setProgress(90);
    if (stage === "finalizing") setProgress(99);
    if (stage === "complete") setProgress(100);
    if (stage === "gas-selection" || stage === "wallet-connection") setProgress(0);
    if (stage === "wallet-sign") setProgress(20);
  }, [stage]);

  // Handler to start minting after user confirms tx
  const handleStartMint = async () => {
    setStage("wallet-sign");
    const res = await onStartMint({ gasSpeed });
    if (res && res.error) {
      const errType = identifyErrorType(res.error || "");
      setErrorInfo({
        message: res.error,
        code: errType.code,
        txHash: res.txHash,
        isUserRejection: !!errType.isUserRejection,
      });
      setTxHash(res.txHash || null);
      setStage("error");
      if (typeof window !== "undefined") {
        window.console?.error?.(
          "[MINTING_ERROR_LOG]", 
          {
            reason: res.error,
            txHash: res.txHash,
            type: errType.code,
            when: new Date().toISOString(),
          }
        );
      }
    } else {
      if (res && res.txHash) setTxHash(res.txHash);
      setStage("txn-pending");
    }
  };

  function renderStepContent() {
    if (stage === "error") {
      return (
        <ErrorDisplaySection
          errorInfo={errorInfo}
          chainId={chainId}
          onClose={onClose}
        />
      );
    }

    switch (stage) {
      case "wallet-connection":
        return (
          <div>
            <WalletStatusSection
              walletConnected={walletConnected}
              walletAddress={walletAddress}
            />
            <div className="text-center text-sm text-body-text/80 mt-2">
              Please connect your wallet to begin minting your Drop.
            </div>
          </div>
        );
      case "gas-selection":
        return (
          <div>
            <DropSummarySection
              projectIdea={projectIdea}
              roles={roles}
              expenses={expenses}
              coverBase64={coverBase64}
            />
            <GasOptionsSection
              gasLoading={gasLoading}
              estNetwork={estNetwork}
              gasFees={gasFees}
              gasSpeed={gasSpeed}
              setGasSpeed={setGasSpeed}
            />
            <Button className="w-full mt-4" onClick={() => setStage("wallet-sign")}>
              Confirm Transaction
            </Button>
          </div>
        );
      case "wallet-sign":
        return (
          <div className="text-center">
            <Loader className="animate-spin mx-auto mb-2" />
            <div className="font-medium mb-2">Awaiting Wallet Confirmation...</div>
            <div className="text-sm text-body-text/80">
              Please approve the transaction in your wallet. Check your wallet popup.
            </div>
          </div>
        );
      case "sending-transaction":
      case "txn-pending":
      case "generating-cover":
      case "minting-token":
      case "finalizing":
        return (
          <ProgressDisplaySection
            stage={stage}
            stepLabel={stepLabels[stage]}
            progress={progress}
            txHash={txHash}
            chainId={chainId}
          />
        );
      case "complete":
        return (
          <CompletionDisplaySection
            txHash={txHash}
            chainId={chainId}
            onClose={onClose}
          />
        );
      default:
        return null;
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl bg-surface font-sans">
        <div className="flex flex-col gap-1">
          <div className="text-accent font-bold uppercase text-xs tracking-wider mb-3 text-center">
            Mint &amp; Fund Drop
          </div>
          {renderStepContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};
