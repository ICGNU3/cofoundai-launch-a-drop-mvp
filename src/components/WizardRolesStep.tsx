
import React, { useState } from "react";
import { AddRoleModal } from "./ui/AddRoleModal";
import { PercentBar } from "./ui/PercentBar";
import { AccentButton } from "./ui/AccentButton";
import { ProjectTypeSelector } from "./ui/ProjectTypeSelector";
import { RoleTemplateManager } from "./ui/RoleTemplateManager";
import { RolesList } from "./ui/RolesList";
import { RolePercentageStatus } from "./ui/RolePercentageStatus";
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
  const disableStep2Next = sumPercent !== 100;

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

  return (
    <div>
      <h2 className="headline text-center mb-2">Crew &amp; Cut</h2>
      <div className="flex flex-col gap-2">

        <ProjectTypeSelector
          projectType={projectType}
          onProjectTypeChange={handleProjectTypeChange}
          loadDefaultRoles={loadDefaultRoles}
        />

        <RoleTemplateManager
          roles={roles}
          setField={setField}
        />

        {/* PercentBar - live feedback on allocation */}
        <PercentBar used={sumPercent} />

        <RolesList
          roles={roles}
          onEditRole={handleEditRole}
          onRemoveRole={removeRole}
          onAddRole={handleAddRole}
        />

        <RolePercentageStatus sumPercent={sumPercent} />

        <div className="flex gap-2 mt-2">
          <AccentButton
            secondary
            className="w-1/2"
            onClick={() => setStep(1)}
          >← Back</AccentButton>
          <AccentButton
            className="w-1/2"
            disabled={disableStep2Next}
            onClick={() => setStep(3)}
          >Next: Expenses →</AccentButton>
        </div>
      </div>
      {/* AddRoleModal */}
      <AddRoleModal
        open={roleModalOpen}
        defaultRole={
          editingRoleIdx !== null ? roles[editingRoleIdx] : undefined
        }
        onClose={() => setRoleModalOpen(false)}
        onSave={role => {
          saveRole({ ...role, isFixed: false }, editingRoleIdx);
          setRoleModalOpen(false);
        }}
        existingRoles={roles}
      />
    </div>
  );
};
