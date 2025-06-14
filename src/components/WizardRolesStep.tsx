import React, { useState } from "react";
import { RolePill } from "./ui/RolePill";
import { AddRoleModal } from "./ui/AddRoleModal";
import { PercentBar } from "./ui/PercentBar";
import { AccentButton } from "./ui/AccentButton";
import type { Role, ProjectType } from "@/hooks/useWizardState";
import { useRoleTemplates } from "@/hooks/useRoleTemplates";
import { useToast } from "@/hooks/use-toast";

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

  // Role templates - in-memory only
  const templatesCtx = useRoleTemplates();
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");

  // Toast notifications
  const { toast } = useToast();

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

  // Handle load/save for templates
  const handleSaveTemplate = () => {
    if (newTemplateName.trim()) {
      templatesCtx.saveTemplate(newTemplateName.trim(), roles);
      setNewTemplateName("");
      setShowTemplateMenu(false);
      toast({
        title: "Template Saved",
        description: `Saved template '${newTemplateName.trim()}'`,
      });
    }
  };

  const handleLoadTemplate = (templateName: string) => {
    const tplRoles = templatesCtx.loadTemplate(templateName);
    if (tplRoles) {
      setField("roles", tplRoles.map(r => ({ ...r }))); // Deep copy to prevent reference bugs
      setShowTemplateMenu(false);
      toast({
        title: "Template Loaded",
        description: `Loaded template '${templateName}'`,
      });
    }
  };

  const handleDeleteTemplate = (templateName: string) => {
    templatesCtx.deleteTemplate(templateName);
    toast({
      title: "Template Deleted",
      description: `Deleted template '${templateName}'`,
    });
  };

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

        {/* Role Templates UI */}
        <div className="mb-2 flex flex-col gap-1">
          <button
            type="button"
            className="self-end text-xs border px-2 py-0.5 rounded bg-[#181818] border-[#343439] text-accent hover:bg-[#232323] transition mb-1"
            onClick={() => setShowTemplateMenu(v => !v)}
          >
            {showTemplateMenu ? "Hide Templates" : "Role Templates"}
          </button>
          {showTemplateMenu && (
            <div className="rounded border border-border bg-card p-3 text-xs mt-0.5 flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <div className="font-semibold mb-1">Save Current as Template</div>
                <div className="flex gap-1">
                  <input
                    placeholder="Template Name"
                    className="p-1 border border-border rounded bg-[#232323] text-xs w-full"
                    value={newTemplateName}
                    onChange={e => setNewTemplateName(e.target.value)}
                    maxLength={32}
                  />
                  <button
                    className="text-xs px-2 py-1 bg-accent/80 text-background rounded hover:bg-accent"
                    onClick={handleSaveTemplate}
                    disabled={!newTemplateName.trim()}
                  >
                    Save
                  </button>
                </div>
              </div>
              <div>
                <div className="font-semibold mb-1">Load a Template</div>
                {templatesCtx.templates.length === 0 && (
                  <div className="text-neutral-500 italic">No templates saved</div>
                )}
                <ul className="flex flex-col gap-1">
                  {templatesCtx.templates.map(tpl => (
                    <li key={tpl.name} className="flex items-center gap-2">
                      <button
                        className="text-accent hover:underline underline-offset-2 text-sm px-1"
                        onClick={() => handleLoadTemplate(tpl.name)}
                        type="button"
                      >
                        {tpl.name}
                      </button>
                      <button
                        className="ml-1 text-[11px] text-red-400 border rounded px-1 py-0.5 border-border hover:bg-red-400/20"
                        onClick={() => handleDeleteTemplate(tpl.name)}
                        type="button"
                        aria-label={`Delete template ${tpl.name}`}
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

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
