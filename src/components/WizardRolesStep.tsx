
import React, { useState } from "react";
import { AddRoleModal } from "./ui/AddRoleModal";
import { WizardNavigationButtons } from "./ui/WizardNavigationButtons";
import { RoleStepHeader } from "./wizard/step2/RoleStepHeader";
import { TeamModeSection } from "./wizard/step2/TeamModeSection";
import { SoloModeSection } from "./wizard/step2/SoloModeSection";
import type { Role, ProjectType, ProjectMode } from "@/hooks/useWizardState";

type WizardRolesStepProps = {
  roles: Role[];
  editingRoleIdx: number | null;
  projectType: ProjectType;
  mode: ProjectMode;
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
  mode,
  setField,
  loadDefaultRoles,
  saveRole,
  removeRole,
  setStep,
}) => {
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  // Percent validation
  const sumPercent = roles.reduce((sum, r) => sum + r.percent, 0);
  const canProceed = mode === "solo" ? true : sumPercent === 100;

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
      <RoleStepHeader mode={mode} />
      
      <div className="flex flex-col gap-2">
        {mode === "team" ? (
          <TeamModeSection
            projectType={projectType}
            roles={roles}
            onProjectTypeChange={handleProjectTypeChange}
            onLoadDefaultRoles={loadDefaultRoles}
            onLoadTemplate={handleLoadTemplate}
            onEditRole={handleEditRole}
            onRemoveRole={removeRole}
            onAddRole={handleAddRole}
          />
        ) : (
          <SoloModeSection />
        )}

        <WizardNavigationButtons
          canProceed={canProceed}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      </div>

      {mode === "team" && (
        <AddRoleModal
          open={roleModalOpen}
          defaultRole={editingRoleIdx !== null ? roles[editingRoleIdx] : undefined}
          onClose={() => setRoleModalOpen(false)}
          onSave={handleSaveRole}
          existingRoles={roles}
        />
      )}
    </div>
  );
};
