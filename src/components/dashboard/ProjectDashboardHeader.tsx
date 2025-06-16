
import React from "react";
import { ProjectLaunchHub } from "@/components/ProjectLaunchHub";
import { ProjectHeaderSection } from "@/components/ProjectHeaderSection";

interface ProjectDashboardHeaderProps {
  project: any;
  isNewlyLaunched: boolean;
  isLoading: boolean;
  onRefresh: () => void;
}

export const ProjectDashboardHeader: React.FC<ProjectDashboardHeaderProps> = ({
  project,
  isNewlyLaunched,
  isLoading,
  onRefresh,
}) => {
  return (
    <>
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
        onRefresh={onRefresh}
        projectIdea={project.project_idea}
      />
    </>
  );
};
