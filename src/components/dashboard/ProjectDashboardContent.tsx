
import React from "react";
import { StatusCardsSection } from "@/components/StatusCardsSection";
import { FundingProgressSection } from "@/components/FundingProgressSection";
import { ActiveStreamsSection } from "@/components/ActiveStreamsSection";
import { AllRolesSection } from "@/components/AllRolesSection";
import { NavigationSection } from "@/components/NavigationSection";

interface ProjectDashboardContentProps {
  project: any;
  activeStreams: any[];
  totalFlowRate: number;
}

export const ProjectDashboardContent: React.FC<ProjectDashboardContentProps> = ({
  project,
  activeStreams,
  totalFlowRate,
}) => {
  return (
    <>
      <StatusCardsSection
        tokenAddress={project.token_address}
        txHash={project.tx_hash}
        escrowFundedAmount={project.escrow_funded_amount}
        expenseSum={project.expense_sum}
        streamsActive={project.streams_active}
        rolesCount={project.roles.length}
        activeStreamsCount={activeStreams.length}
        totalFlowRate={totalFlowRate}
      />

      <FundingProgressSection project={project} />

      <ActiveStreamsSection activeStreams={activeStreams} />

      <AllRolesSection roles={project.roles} />

      <NavigationSection />
    </>
  );
};
