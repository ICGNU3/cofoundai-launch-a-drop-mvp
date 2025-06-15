
import React, { useState } from "react";
import type { Role } from "@/hooks/useWizardState";
import { useRoleTemplates } from "@/hooks/useRoleTemplates";
import { useToast } from "@/hooks/use-toast";

type RoleTemplateManagerProps = {
  roles: Role[];
  onLoadTemplate: (roles: Role[]) => void;
};

export const RoleTemplateManager: React.FC<RoleTemplateManagerProps> = ({
  roles,
  onLoadTemplate,
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
      onLoadTemplate(tplRoles.map(r => ({ ...r })));
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
    <div className="mb-4">
      <button
        type="button"
        className="text-xs border px-2 py-1 rounded bg-[#181818] border-[#343439] text-accent hover:bg-[#232323] transition"
        onClick={() => setShowTemplateMenu(v => !v)}
      >
        {showTemplateMenu ? "Hide Templates" : "Role Templates"}
      </button>
      {showTemplateMenu && (
        <div className="rounded border border-border bg-card p-3 text-xs mt-2 space-y-3">
          <div>
            <div className="font-semibold mb-2">Save Current as Template</div>
            <div className="flex gap-2">
              <input
                placeholder="Template Name"
                className="p-2 border border-border rounded bg-[#232323] text-xs flex-1"
                value={newTemplateName}
                onChange={e => setNewTemplateName(e.target.value)}
                maxLength={32}
              />
              <button
                className="text-xs px-3 py-2 bg-accent/80 text-background rounded hover:bg-accent"
                onClick={handleSaveTemplate}
                disabled={!newTemplateName.trim()}
              >
                Save
              </button>
            </div>
          </div>
          {templatesCtx.templates.length > 0 && (
            <div>
              <div className="font-semibold mb-2">Load Template</div>
              <ul className="space-y-1">
                {templatesCtx.templates.map(tpl => (
                  <li key={tpl.name} className="flex items-center gap-2">
                    <button
                      className="text-accent hover:underline text-sm px-1"
                      onClick={() => handleLoadTemplate(tpl.name)}
                      type="button"
                    >
                      {tpl.name}
                    </button>
                    <button
                      className="text-xs text-red-400 border rounded px-1 py-0.5 border-border hover:bg-red-400/20"
                      onClick={() => handleDeleteTemplate(tpl.name)}
                      type="button"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
