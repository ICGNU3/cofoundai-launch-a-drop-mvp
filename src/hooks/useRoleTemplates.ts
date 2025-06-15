
import { useState } from "react";
import type { Role } from "./useWizardState";

export type RoleTemplate = {
  name: string;
  roles: Role[];
};

export function useRoleTemplates() {
  const [templates, setTemplates] = useState<RoleTemplate[]>([]);

  const saveTemplate = (name: string, roles: Role[]) => {
    setTemplates(prev => {
      const idx = prev.findIndex(t => t.name === name);
      // Deep copy skills & descriptions to prevent mutations
      const deepRoles = roles.map(r => ({
        ...r,
        description: r.description || "",
        skills: Array.isArray(r.skills) ? [...r.skills] : []
      }));
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = { name, roles: deepRoles };
        return copy;
      }
      return [...prev, { name, roles: deepRoles }];
    });
  };

  const loadTemplate = (name: string): Role[] | undefined => {
    const found = templates.find(t => t.name === name);
    // Defensive copy again
    return found
      ? found.roles.map(r => ({
          ...r,
          description: r.description || "",
          skills: Array.isArray(r.skills) ? [...r.skills] : []
        }))
      : undefined;
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
