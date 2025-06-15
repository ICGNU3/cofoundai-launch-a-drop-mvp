import React from "react";

type RolesListProps = {
  roles: any[];
  onEditRole: (idx: number) => void;
  onRemoveRole: (idx: number) => void;
  onAddRole: () => void;
  onUpdateRolePercent?: (idx: number, newPercent: number) => void;
};

export const RolesList: React.FC<RolesListProps> = ({
  roles,
  onEditRole,
  onRemoveRole,
  onAddRole,
  onUpdateRolePercent,
}) => (
  <div className="mb-2">
    <button
      className="mb-3 text-xs border px-3 py-1 rounded bg-accent text-white hover:bg-accent/90"
      type="button"
      onClick={onAddRole}
    >
      + Add Role
    </button>
    <div className="flex flex-col gap-3">
      {roles.map((role, idx) => (
        <div key={idx} className="bg-card border border-border rounded p-3 relative group">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold">{role.roleName}</span>
              <span className="ml-2 text-xs text-zinc-500">{role.percent}%</span>
            </div>
            <div className="flex gap-1">
              <button
                aria-label="Edit role"
                className="text-accent border rounded px-2 px-1 py-0.5 text-xs mr-2"
                onClick={() => onEditRole(idx)}
              >Edit</button>
              <button
                aria-label="Remove role"
                className="text-destructive border rounded px-2 px-1 py-0.5 text-xs"
                onClick={() => onRemoveRole(idx)}
              >Remove</button>
            </div>
          </div>
          {role.description && (
            <div className="mt-2 text-xs text-zinc-400 whitespace-pre-wrap">{role.description}</div>
          )}
          {role.skills && role.skills.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {role.skills.map((skill: string, i: number) => (
                <span
                  key={i}
                  className="bg-accent/10 text-accent border border-accent rounded px-2 py-0.5 text-xxs"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
    {/* Find Talent Button */}
    <div className="mt-4 flex justify-end">
      <a
        className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 text-sm font-medium"
        href="https://web3.career/" // Replace with community pool or talent board as needed
        target="_blank"
        rel="noopener noreferrer"
      >Find Talent</a>
    </div>
    {/* Placeholder for future profile/portfolio */}
    <div className="mt-3 text-xs text-zinc-400 text-right">
      <span className="italic">Future: Portfolio/profile integration coming soon…</span>
    </div>
  </div>
);
