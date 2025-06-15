
import React, { useState } from "react";
import { AddRoleModal } from "./ui/AddRoleModal";
import { ProjectTypeSelector } from "./ui/ProjectTypeSelector";
import { RoleTemplateManager } from "./ui/RoleTemplateManager";
import { RoleManagementSection } from "./ui/RoleManagementSection";
import { WizardNavigationButtons } from "./ui/WizardNavigationButtons";
import type { Role, ProjectType } from "@/hooks/useWizardState";

type WizardRolesStepProps = {
  roles: Role[];
  editingRoleIdx: number | null;
  projectType: ProjectType;
  setField: (field: keyof any, value: any) => void;
  loadDefaultRoles: (type: ProjectType) => void;
  saveRole: (role: Role, idx: number | null) => void;
  removeRole: (idx: number) => void;
  setStep: (s: 1 | 2 | 3) => void;
};

export const WizardRolesStep: React.FC<WizardRolesStepProps> = ({
  roles,
  editingRoleIdx,
  projectType,
  setField,
  loadDefaultRoles,
  saveRole,
  removeRole,
  setStep,
}) => {
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  // Percent validation
  const sumPercent = roles.reduce((sum, r) => sum + r.percent, 0);
  const canProceed = sumPercent === 100;

  const handleEditRole = (idx: number) => {
    setField("editingRoleIdx", idx);
    setRoleModalOpen(true);
  };

  const handleAddRole = () => {
    setField("editingRoleIdx", null);
    setRoleModalOpen(true);
  };

  const handleProjectTypeChange = (newType: ProjectType) => {
    setField("projectType", newType);
  };

  const handleSaveRole = (role: Role) => {
    saveRole({ ...role, isFixed: false }, editingRoleIdx);
    setRoleModalOpen(false);
  };

  const handleLoadTemplate = (templateRoles: Role[]) => {
    setField("roles", templateRoles);
  };

  return (
    <div>
      <h2 className="headline text-center mb-2">Crew &amp; Cut</h2>
      
      <div className="flex flex-col gap-2">
        <ProjectTypeSelector
          projectType={projectType}
          onProjectTypeChange={handleProjectTypeChange}
          onLoadDefaultRoles={loadDefaultRoles}
        />

        <RoleTemplateManager
          roles={roles}
          onLoadTemplate={handleLoadTemplate}
        />

        <RoleManagementSection
          roles={roles}
          onEditRole={handleEditRole}
          onRemoveRole={removeRole}
          onAddRole={handleAddRole}
        />

        <WizardNavigationButtons
          canProceed={canProceed}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      </div>

      <AddRoleModal
        open={roleModalOpen}
        defaultRole={editingRoleIdx !== null ? roles[editingRoleIdx] : undefined}
        onClose={() => setRoleModalOpen(false)}
        onSave={handleSaveRole}
        existingRoles={roles}
      />
    </div>
  );
};
