
import React, { useState } from "react";
import { RolePill } from "./ui/RolePill";
import { AddRoleModal } from "./ui/AddRoleModal";
import { PercentBar } from "./ui/PercentBar";
import { AccentButton } from "./ui/AccentButton";
import type { Role, ProjectType } from "@/hooks/useWizardState";

const projectTypes: ProjectType[] = ["Music", "Film", "Fashion", "Art", "Other"];

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
  let percentMsg = "";
  let percentColor = "";
  if (sumPercent < 100)
    percentMsg = `Need ${100 - sumPercent} % allocated`;
  else if (sumPercent > 100)
    percentMsg = `Remove ${sumPercent - 100} % (over-allocated)`;
  else percentMsg = "Cuts balanced ✓";
  percentColor = sumPercent === 100 ? "text-green-400" : "text-red-500";
  const disableStep2Next = sumPercent !== 100;

  return (
    <div>
      <h2 className="headline text-center mb-2">Crew &amp; Cut</h2>
      <div className="flex flex-col gap-2">
        <label className="block mb-1 text-body-text font-semibold">
          Project Type
        </label>
        <select
          className="w-full mb-2"
          value={projectType}
          onChange={e => {
            setField("projectType", e.target.value as ProjectType);
            loadDefaultRoles(e.target.value as ProjectType);
          }}
        >
          {projectTypes.map(type => (
            <option value={type} key={type}>{type}</option>
          ))}
        </select>

        {/* PercentBar - live feedback on allocation */}
        <PercentBar used={sumPercent} />

        {/* Role Pills */}
        <div className="mb-2 flex flex-wrap gap-2">
          {roles.map((role, i) => (
            <RolePill
              key={i}
              role={role}
              onEdit={() => {
                setField("editingRoleIdx", i);
                setRoleModalOpen(true);
              }}
              onDelete={() => removeRole(i)}
            />
          ))}
          <button
            className="role-pill bg-[#222] text-accent border-accent hover:bg-accent/10 ml-1"
            onClick={() => {
              setField("editingRoleIdx", null);
              setRoleModalOpen(true);
            }}
            aria-label="Add Role"
            type="button"
          >
            + Add Role
          </button>
        </div>
        <div className={`text-sm font-semibold ${percentColor} mb-2`}>{percentMsg}</div>
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
