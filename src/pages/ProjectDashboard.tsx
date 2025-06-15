import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../integrations/supabase/client";
import { usePrivy } from "@privy-io/react-auth";
import { ProjectFundingProgress } from "@/components/ProjectOverviewParts";
import { ProjectLaunchHub } from "@/components/ProjectLaunchHub";
import { useState } from "react";
import { CollaboratorInviteModal } from "@/components/CollaboratorInviteModal";
import { CollaboratorsSection } from "@/components/CollaboratorsSection";
import { ProjectHeaderSection } from "@/components/ProjectHeaderSection";
import { StatusCardsSection } from "@/components/StatusCardsSection";
import { FundingProgressSection } from "@/components/FundingProgressSection";
import { ActiveStreamsSection } from "@/components/ActiveStreamsSection";
import { AllRolesSection } from "@/components/AllRolesSection";
import { NavigationSection } from "@/components/NavigationSection";
import { TeamDirectory } from "@/components/TeamManagement/TeamDirectory";
import { RolePermissionsPanel } from "@/components/TeamManagement/RolePermissionsPanel";
import { ProjectChat } from "@/components/TeamManagement/ProjectChat";
import UnifiedPeopleSection from "@/components/UnifiedPeopleSection";
import { useProjectFullData } from "@/hooks/useProjectFullData";

type ProjectWithDetails = {
  id: string;
  owner_id: string;
  project_idea: string;
  project_type: string;
  token_address: string | null;
  tx_hash: string | null;
  expense_sum: number | null;
  escrow_funded_amount: number | null;
  streams_active: boolean | null;
  funding_total: number | null;
  funding_target: number | null;
  minted_at: string | null;
  cover_art_url: string | null;
  roles: Array<{
    id: string;
    name: string;
    percent: number;
    stream_flow_rate: number | null;
    stream_active: boolean | null;
    wallet_address: string | null;
  }>;
};

const ProjectDashboard: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = usePrivy();

  const { data: project, isLoading, refetch } = useProjectFullData(projectId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-body-text">Loading project dashboard...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-body-text">Project not found</div>
      </div>
    );
  }

  const activeStreams = project.roles.filter((role: any) => role.stream_active);
  const totalFlowRate = activeStreams.reduce((sum: number, role: any) => sum + (role.stream_flow_rate || 0), 0);

  const isNewlyLaunched = project.minted_at &&
    Date.now() - new Date(project.minted_at).getTime() < 10 * 60 * 1000;

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Team & Collaborators: unified */}
        <UnifiedPeopleSection projectId={projectId!} projectOwnerId={project.owner_id} />

        {/* The rest of the dashboard remains as before */}
        {isNewlyLaunched && (
          <div className="mb-8">
            <ProjectLaunchHub
              project={project}
              roles={project.roles}
            />
          </div>
        )}

        <ProjectHeaderSection
          projectName={project.project_idea}
          projectType={project.project_type}
          isNewlyLaunched={!!isNewlyLaunched}
          isLoading={isLoading}
          onRefresh={refetch}
          projectIdea={project.project_idea}
        />

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
      </div>
    </div>
  );
};

export default ProjectDashboard;
