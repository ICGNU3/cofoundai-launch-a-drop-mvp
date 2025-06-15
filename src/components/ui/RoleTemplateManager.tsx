
import React, { useState } from "react";
import type { Role } from "@/hooks/useWizardState";
import { useRoleTemplates } from "@/hooks/useRoleTemplates";
import { useToast } from "@/hooks/use-toast";

type RoleTemplateManagerProps = {
  roles: Role[];
  setField: (field: keyof any, value: any) => void;
};

export const RoleTemplateManager: React.FC<RoleTemplateManagerProps> = ({
  roles,
  setField,
}) => {
  const templatesCtx = useRoleTemplates();
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const { toast } = useToast();

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
  );
};
