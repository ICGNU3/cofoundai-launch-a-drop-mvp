
import React from "react";
import { ProjectTypeSelector } from "@/components/ui/ProjectTypeSelector";
import type { ProjectType } from "@/hooks/useWizardState";

interface ProjectTypeSectionProps {
  projectType: ProjectType;
  onProjectTypeChange: (type: ProjectType) => void;
  onLoadDefaultRoles: (type: ProjectType) => void;
}

export const ProjectTypeSection: React.FC<ProjectTypeSectionProps> = ({
  projectType,
  onProjectTypeChange,
  onLoadDefaultRoles,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Project Type <span className="text-red-500">*</span>
      </label>
      <ProjectTypeSelector 
        projectType={projectType}
        onProjectTypeChange={onProjectTypeChange}
        onLoadDefaultRoles={onLoadDefaultRoles}
      />
    </div>
  );
};
