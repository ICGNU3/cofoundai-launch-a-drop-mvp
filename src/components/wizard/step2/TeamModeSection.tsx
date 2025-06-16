
import React from "react";
import { ProjectTypeSelector } from "@/components/ui/ProjectTypeSelector";
import { RoleTemplateManager } from "@/components/ui/RoleTemplateManager";
import { RoleManagementSection } from "@/components/ui/RoleManagementSection";
import type { Role, ProjectType } from "@/hooks/useWizardState";

interface TeamModeSectionProps {
  projectType: ProjectType;
  roles: Role[];
  onProjectTypeChange: (newType: ProjectType) => void;
  onLoadDefaultRoles: (type: ProjectType) => void;
  onLoadTemplate: (templateRoles: Role[]) => void;
  onEditRole: (idx: number) => void;
  onRemoveRole: (idx: number) => void;
  onAddRole: () => void;
}

export const TeamModeSection: React.FC<TeamModeSectionProps> = ({
  projectType,
  roles,
  onProjectTypeChange,
  onLoadDefaultRoles,
  onLoadTemplate,
  onEditRole,
  onRemoveRole,
  onAddRole,
}) => {
  return (
    <>
      <ProjectTypeSelector
        projectType={projectType}
        onProjectTypeChange={onProjectTypeChange}
        onLoadDefaultRoles={onLoadDefaultRoles}
      />

      <RoleTemplateManager
        roles={roles}
        onLoadTemplate={onLoadTemplate}
      />

      <RoleManagementSection
        roles={roles}
        onEditRole={onEditRole}
        onRemoveRole={onRemoveRole}
        onAddRole={onAddRole}
      />
    </>
  );
};
