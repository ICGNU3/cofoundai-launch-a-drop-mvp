
import React, { useState } from "react";
import { AddRoleModal } from "./ui/AddRoleModal";
import { ProjectTypeSelector } from "./ui/ProjectTypeSelector";
import { RoleTemplateManager } from "./ui/RoleTemplateManager";
import { RoleManagementSection } from "./ui/RoleManagementSection";
import { WizardNavigationButtons } from "./ui/WizardNavigationButtons";
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
      <h2 className="headline text-center mb-2">
        {mode === "solo" ? "Solo Creator" : "Crew & Cut"}
      </h2>
      
      <div className="flex flex-col gap-2">
        {mode === "team" && (
          <>
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
          </>
        )}

        {mode === "solo" && (
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg">Creator</span>
                  <span className="text-green-500 font-mono">100%</span>
                </div>
                <div className="text-sm text-green-500 flex items-center gap-1">
                  <span>✓</span>
                  <span>Cuts balanced</span>
                </div>
              </div>
              <div className="mt-2 text-sm text-body-text/60">
                Full ownership and control of your project
              </div>
            </div>
          </div>
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
