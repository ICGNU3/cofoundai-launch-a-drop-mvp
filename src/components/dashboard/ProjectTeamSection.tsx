
import React from "react";
import UnifiedPeopleSection from "@/components/UnifiedPeopleSection";

interface ProjectTeamSectionProps {
  projectId: string;
  projectOwnerId: string;
}

export const ProjectTeamSection: React.FC<ProjectTeamSectionProps> = ({
  projectId,
  projectOwnerId,
}) => {
  return (
    <UnifiedPeopleSection 
      projectId={projectId} 
      projectOwnerId={projectOwnerId} 
    />
  );
};
