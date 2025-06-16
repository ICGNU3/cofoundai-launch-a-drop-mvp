
import React from "react";
import { useParams } from "react-router-dom";
import { useProjectFullData } from "@/hooks/useProjectFullData";
import { ProjectDashboardHeader } from "@/components/dashboard/ProjectDashboardHeader";
import { ProjectDashboardContent } from "@/components/dashboard/ProjectDashboardContent";
import { ProjectTeamSection } from "@/components/dashboard/ProjectTeamSection";

const ProjectDashboard: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
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
        <ProjectTeamSection 
          projectId={projectId!} 
          projectOwnerId={project.owner_id} 
        />

        <ProjectDashboardHeader
          project={project}
          isNewlyLaunched={!!isNewlyLaunched}
          isLoading={isLoading}
          onRefresh={refetch}
        />

        <ProjectDashboardContent
          project={project}
          activeStreams={activeStreams}
          totalFlowRate={totalFlowRate}
        />
      </div>
    </div>
  );
};

export default ProjectDashboard;
