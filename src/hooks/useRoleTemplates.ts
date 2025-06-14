
import { useState } from "react";
import type { Role } from "./useWizardState";

export type RoleTemplate = {
  name: string;
  roles: Role[];
};

export function useRoleTemplates() {
  const [templates, setTemplates] = useState<RoleTemplate[]>([]);

  const saveTemplate = (name: string, roles: Role[]) => {
    // Overwrite if name exists, else add
    setTemplates(prev => {
      const idx = prev.findIndex(t => t.name === name);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = { name, roles };
        return copy;
      }
      return [...prev, { name, roles }];
    });
  };

  const loadTemplate = (name: string): Role[] | undefined => {
    const found = templates.find(t => t.name === name);
    return found ? found.roles : undefined;
  };

  const deleteTemplate = (name: string) => {
    setTemplates(prev => prev.filter(t => t.name !== name));
  };

  return {
    templates,
    saveTemplate,
    loadTemplate,
    deleteTemplate,
  };
}
