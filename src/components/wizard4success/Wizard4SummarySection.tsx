
import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Share } from "lucide-react";
import { ProjectSummaryCard } from "../ProjectSummaryCard";
import { MintingStatusCard } from "../MintingStatusCard";
import { ProjectPreviewCard } from "../ProjectPreviewCard";
import { ProjectActionButtons } from "../ProjectActionButtons";

interface Wizard4SummarySectionProps {
  coverBase64: string | null | undefined;
  coverIpfs: string | null;
  projectIdea: string;
  projectType: string;
  roles: any[];
  expenses: any[];
  expenseSum: number;
  fundingTarget: number;
  isMinted: boolean;
  projectRow: any;
  projectId: string | null;
  currentStep: string;
  handleShareDrop: () => void;
  mintingStatus: string;
  isMinting: boolean;
  isPollingBalance: boolean;
  walletAddress: string | null;
  loadingMint: boolean;
  usdcxBalanceConfirmed: boolean;
  onMintAndFund: () => void;
  onRestart: () => void;
}

export const Wizard4SummarySection: React.FC<Wizard4SummarySectionProps> = ({
  coverBase64,
  coverIpfs,
  projectIdea,
  projectType,
  roles,
  expenses,
  expenseSum,
  fundingTarget,
  isMinted,
  projectRow,
  projectId,
  currentStep,
  handleShareDrop,
  mintingStatus,
  isMinting,
  isPollingBalance,
  walletAddress,
  loadingMint,
  usdcxBalanceConfirmed,
  onMintAndFund,
  onRestart,
}) => (
  <div className="space-y-6">
    {(coverBase64 || coverIpfs) && (
      <div className="w-full flex flex-col items-center">
        <label className="mb-1 text-sm text-body-text/60">Your Cover Art:</label>
        <a
          href={coverIpfs ? `https://ipfs.io/ipfs/${coverIpfs}` : undefined}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={0}
          aria-label="Open uploaded cover on IPFS"
          className="block rounded border-2 border-accent shadow-lg p-1 max-w-[240px] hover:scale-105 transition mb-2"
          style={{ pointerEvents: coverIpfs ? "auto" : "none", opacity: coverIpfs ? 1 : 0.7 }}
        >
          <img
            src={coverBase64 || (coverIpfs ? `https://ipfs.io/ipfs/${coverIpfs}` : "")}
            alt="Uploaded Cover Art"
            className="rounded max-h-48 w-auto"
          />
        </a>
        {coverIpfs && (
          <small className="text-xs text-accent">
            <a href={`https://ipfs.io/ipfs/${coverIpfs}`} target="_blank" rel="noopener noreferrer">
              View on IPFS
            </a>
          </small>
        )}
      </div>
    )}

    <ProjectSummaryCard
      projectIdea={projectIdea}
      projectType={projectType}
      rolesCount={roles.length}
      expenseSum={expenseSum}
      fundingTarget={fundingTarget}
    />

    {isMinted && (
      <div className="text-center my-4">
        <a
          href={projectRow?.token_address ? `https://zora.co/collect/${projectRow.token_address}` : "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded shadow hover:bg-primary/90"
          style={{ pointerEvents: projectRow?.token_address ? "auto" : "none", opacity: projectRow?.token_address ? 1 : 0.5 }}
        >
          Collect Drop
        </a>
        <div className="mt-2 text-sm">
          <span className="font-semibold text-accent">Pledge status:</span>{" "}
          <span>
            {projectRow?.pledge_usdc && Number(projectRow.pledge_usdc) > 0
              ? `Pledged ${projectRow.pledge_usdc} USDC`
              : "No pledge"}
          </span>
        </div>
      </div>
    )}

    {/* Show Share button after successful launch */}
    {projectId && currentStep === "complete" && (
      <div className="flex justify-center">
        <Button
          className="gap-2 border transition-all hover:shadow-lg [&_svg]:shrink-0 bg-surface"
          variant="outline"
          onClick={handleShareDrop}
        >
          <Share size={18} />
          Share your Drop
        </Button>
      </div>
    )}

    <MintingStatusCard
      status={mintingStatus}
      isMinting={isMinting}
      isPollingBalance={isPollingBalance}
    />

    <ProjectPreviewCard roles={roles} expenses={expenses} />

    <ProjectActionButtons
      projectId={projectId}
      walletAddress={walletAddress}
      isMinting={isMinting || loadingMint}
      usdcxBalanceConfirmed={usdcxBalanceConfirmed}
      onMintAndFund={onMintAndFund}
      onRestart={onRestart}
    />
  </div>
);
