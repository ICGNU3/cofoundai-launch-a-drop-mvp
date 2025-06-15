
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader, ArrowUp, Check, ArrowDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useGasEstimator } from "./hooks/useGasEstimator";

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

const stepLabels: Record<MintingStepKey, string> = {
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

function getExplorerUrl(chainId: number, txHash: string) {
  // Adjust explorer based on chain, for now assume Zora testnet
  if (chainId === 84532) {
    return `https://testnet.zora.superscan.network/tx/${txHash}`;
  }
  // fallback: etherscan mainnet
  return `https://etherscan.io/tx/${txHash}`;
}

type Props = {
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
};

export const MintingWorkflowModal: React.FC<Props> = ({
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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { gasFees, loading: gasLoading } = useGasEstimator(chainId);

  useEffect(() => {
    if (!open) {
      setStage("wallet-connection");
      setTxHash(null);
      setProgress(0);
      setGasSpeed("standard");
      setErrorMsg(null);
    }
  }, [open]);

  // Wallet state and connection detection
  useEffect(() => {
    if (stage === "wallet-connection" && walletConnected) {
      setStage("gas-selection");
    }
  }, [walletConnected, stage]);

  // Handle step progress (simulate delays for UI feedback, real logic should tie to real events)
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
    if (res.error) {
      setStage("error");
      setErrorMsg(res.error);
    } else {
      if (res.txHash) setTxHash(res.txHash);
      setStage("txn-pending");
    }
  };

  // Compose Drop details preview
  function renderSummary() {
    return (
      <div className="space-y-2 mb-4">
        <div className="text-lg font-bold font-headline mb-2">Drop Summary</div>
        <div className="mb-1">
          <span className="font-semibold">Idea:</span> {projectIdea}
        </div>
        <div className="mb-1">
          <span className="font-semibold">Roles:</span>{" "}
          {roles?.map((r: any) => r.label || r.title || r.name).join(", ")}
        </div>
        <div className="mb-1">
          <span className="font-semibold">Expenses:</span>{" "}
          {expenses?.length
            ? expenses.map((e: any) => `${e.label || e.title}: $${e.amountUSDC}`).join("; ")
            : "None"}
        </div>
        {coverBase64 && (
          <div className="mt-2 flex items-center gap-2">
            <span className="font-semibold">Cover Art:</span>
            <img src={coverBase64} alt="Cover Preview" className="w-12 h-12 rounded border" />
          </div>
        )}
      </div>
    );
  }

  function renderWalletStatus() {
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
  }

  function renderGasOptions() {
    if (gasLoading) return <div className="mb-2">Estimating gas fees...</div>;
    return (
      <div className="space-y-2 mb-4">
        <div className="font-semibold text-sm">Estimated Gas Fees ({estNetwork}):</div>
        <div className="flex flex-col gap-1">
          {["slow", "standard", "fast"].map((speed) => (
            <label key={speed} className={`cursor-pointer flex items-center gap-2 p-2 rounded border
                ${gasSpeed === speed ? "border-accent bg-accent/10" : "border-border"}
              `}>
              <input
                type="radio"
                name="gasSpeed"
                value={speed}
                checked={gasSpeed === speed}
                onChange={() => setGasSpeed(speed as any)}
                className="accent-accent"
              />
              <span className="capitalize mr-2">{speed}</span>
              <span className="font-mono">
                {gasFees[speed] ? `${gasFees[speed]} ETH` : "-"}
              </span>
              {speed === "fast" && <span className="ml-2 text-xs text-orange-300">(Fastest)</span>}
            </label>
          ))}
        </div>
      </div>
    );
  }

  function renderStepContent() {
    // Error
    if (stage === "error")
      return (
        <div className="text-center py-8">
          <div className="text-red-400 mb-2 font-bold text-lg">Minting Failed</div>
          <div className="text-body-text/70">{errorMsg}</div>
          <Button onClick={onClose} className="mt-4">Close</Button>
        </div>
      );

    // Step-by-step
    switch (stage) {
      case "wallet-connection":
        return (
          <div>
            {renderWalletStatus()}
            <div className="text-center text-sm text-body-text/80 mt-2">
              Please connect your wallet to begin minting your Drop.
            </div>
          </div>
        );
      case "gas-selection":
        return (
          <div>
            {renderSummary()}
            {renderGasOptions()}
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
          <div>
            <div className="mb-2 text-center text-lg font-bold">{stepLabels[stage]}</div>
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
      case "complete":
        return (
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
