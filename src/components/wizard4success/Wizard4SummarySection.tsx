
import React from "react";
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import { ProjectSummaryCard } from "../ProjectSummaryCard";
import { MintingStatusCard } from "../MintingStatusCard";
import { TeamBudgetPreviewCard } from "../TeamBudgetPreviewCard";
import { ProjectActionButtons } from "../ProjectActionButtons";
import { Wizard4CoverArtDisplay } from "./Wizard4CoverArtDisplay";
// Import ProjectType for strict typing
import type { ProjectType } from "@/hooks/useWizardState";

// Fix props type: projectType is ProjectType (not string)
interface Wizard4SummarySectionProps {
  coverBase64: string | null | undefined;
  coverIpfs: string | null;
  projectIdea: string;
  projectType: ProjectType;
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
    <Wizard4CoverArtDisplay coverBase64={coverBase64} coverIpfs={coverIpfs} />

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

    <TeamBudgetPreviewCard roles={roles} expenses={expenses} />

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
