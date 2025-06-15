
import React from "react";
import { RolePill } from "./RolePill";
import type { Role } from "@/hooks/useWizardState";

type RolesListProps = {
  roles: Role[];
  onEditRole: (idx: number) => void;
  onRemoveRole: (idx: number) => void;
  onAddRole: () => void;
};

export const RolesList: React.FC<RolesListProps> = ({
  roles,
  onEditRole,
  onRemoveRole,
  onAddRole,
}) => {
  return (
    <div className="mb-2 flex flex-wrap gap-2">
      {roles.map((role, i) => (
        <RolePill
          key={i}
          role={role}
          onEdit={() => onEditRole(i)}
          onDelete={() => onRemoveRole(i)}
        />
      ))}
      <button
        className="role-pill bg-[#222] text-accent border-accent hover:bg-accent/10 ml-1"
        onClick={onAddRole}
        aria-label="Add Role"
        type="button"
      >
        + Add Role
      </button>
    </div>
  );
};
