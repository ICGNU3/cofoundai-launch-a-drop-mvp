
import React from "react";
import { ProjectLaunchHeader } from "./projectLaunch/ProjectLaunchHeader";
import { ProjectCoverArtDisplay } from "./projectLaunch/ProjectCoverArtDisplay";
import { ProjectSharingSection } from "./projectLaunch/ProjectSharingSection";
import { ProjectDetailsOverview } from "./projectLaunch/ProjectDetailsOverview";
import { ProjectNextSteps } from "./projectLaunch/ProjectNextSteps";

interface ProjectLaunchHubProps {
  project: {
    id: string;
    project_idea: string;
    project_type: string;
    token_address: string | null;
    tx_hash: string | null;
    cover_art_url: string | null;
    zora_coin_url?: string;
    funding_target: number;
    funding_total?: number;
  };
  roles: Array<{
    id: string;
    name: string;
    percent: number;
  }>;
}

export const ProjectLaunchHub: React.FC<ProjectLaunchHubProps> = ({
  project,
  roles,
}) => {
  return (
    <div className="bg-card border border-border rounded-lg p-0 shadow-xl max-w-3xl w-full overflow-hidden">
      <ProjectLaunchHeader 
        projectIdea={project.project_idea}
        zoraCoinUrl={project.zora_coin_url}
      />

      <div className="p-8 flex flex-col gap-8">
        <ProjectCoverArtDisplay
          coverArtUrl={project.cover_art_url}
          projectIdea={project.project_idea}
          zoraCoinUrl={project.zora_coin_url}
          fundingTotal={project.funding_total}
          fundingTarget={project.funding_target}
        />

        <ProjectSharingSection project={project} />

        <ProjectDetailsOverview project={project} roles={roles} />

        <ProjectNextSteps projectId={project.id} />
      </div>
    </div>
  );
};
