
import React from "react";

export type RolePillProps = {
  role: { roleName: string, percent: number; };
  onEdit?: () => void;
  onDelete?: () => void;
};
export const RolePill: React.FC<RolePillProps> = ({ role, onEdit, onDelete }) => (
  <span
    className="inline-flex items-center role-pill cursor-pointer select-none"
    onClick={onEdit}
    tabIndex={0}
    aria-label={`Edit ${role.roleName} role`}
  >
    {role.roleName} {role.percent}%
    {onDelete && (
      <button
        className="ml-2 px-1 text-[15px] font-bold text-accent hover:text-white bg-transparent border-0 cursor-pointer"
        aria-label={`Remove ${role.roleName}`}
        onClick={e => { e.stopPropagation(); onDelete(); }}
        tabIndex={-1}
        type="button"
      >
        ×
      </button>
    )}
  </span>
);
