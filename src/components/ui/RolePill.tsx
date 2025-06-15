
import React from "react";
import { Edit, X } from "lucide-react";

export type RolePillProps = {
  role: { roleName: string, percent: number; };
  onEdit?: () => void;
  onDelete?: () => void;
};

export const RolePill: React.FC<RolePillProps> = ({ role, onEdit, onDelete }) => (
  <span
    className="inline-flex items-center role-pill cursor-default select-none border border-accent bg-[#18181a] px-2 py-1 rounded text-[15px]"
    tabIndex={-1}
    aria-label={`Role: ${role.roleName}`}
  >
    <span className="font-medium">{role.roleName}</span>
    <span className="ml-1 font-mono tracking-tight">{role.percent}%</span>
    {onEdit && (
      <button
        className="ml-2 text-accent hover:bg-accent/10 p-1 rounded focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
        aria-label={`Edit ${role.roleName}`}
        tabIndex={0}
        type="button"
        onClick={e => { e.stopPropagation(); onEdit(); }}
      >
        <Edit size={16} />
      </button>
    )}
    {onDelete && (
      <button
        className="ml-1 text-red-400 hover:bg-red-400/10 p-1 rounded focus-visible:outline-2 focus-visible:outline-red-400 focus-visible:outline-offset-2"
        aria-label={`Remove ${role.roleName}`}
        tabIndex={0}
        type="button"
        onClick={e => { e.stopPropagation(); onDelete(); }}
      >
        <X size={16} />
      </button>
    )}
  </span>
);
