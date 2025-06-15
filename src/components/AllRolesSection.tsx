
import React from "react";

interface Role {
  id: string;
  name: string;
  percent: number;
  stream_active: boolean | null;
}

export const AllRolesSection = ({ roles }: { roles: Role[] }) => (
  <div className="bg-card border border-border rounded-lg p-6 mb-8">
    <h3 className="font-semibold text-body-text mb-4">All Roles</h3>
    <div className="space-y-2">
      {roles.map((role) => (
        <div key={role.id} className="flex items-center justify-between p-2 border-b border-border last:border-b-0">
          <div>
            <span className="font-medium text-body-text">{role.name}</span>
            <span className="ml-2 text-sm text-body-text/70">{role.percent}%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              role.stream_active ? 'bg-green-400' : 'bg-gray-400'
            }`}></div>
            <span className="text-xs text-body-text/70">
              {role.stream_active ? 'Streaming' : 'Inactive'}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);
