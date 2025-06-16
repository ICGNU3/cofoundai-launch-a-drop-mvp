
import React from "react";

interface ProjectDetailsOverviewProps {
  project: {
    project_idea: string;
    project_type: string;
  };
  roles: Array<{
    id: string;
    name: string;
    percent: number;
  }>;
}

export const ProjectDetailsOverview: React.FC<ProjectDetailsOverviewProps> = ({
  project,
  roles,
}) => {
  return (
    <div>
      <h4 className="font-semibold text-lg mb-2">Project Overview</h4>
      <div className="grid gap-2 md:grid-cols-2">
        <div>
          <div className="font-medium">Idea</div>
          <div className="text-body-text/90 mb-2">{project.project_idea}</div>
          <div className="font-medium">Type</div>
          <div className="text-body-text/70 mb-2">{project.project_type}</div>
        </div>
        <div>
          <div className="font-medium mb-1">Team Roles</div>
          <ul className="flex flex-wrap gap-2">
            {roles && roles.length > 0 ? (
              roles.map((role) => (
                <li
                  key={role.id}
                  className="bg-accent/10 rounded px-2 py-1 text-sm text-accent font-mono font-semibold"
                >
                  {role.name}
                </li>
              ))
            ) : (
              <li className="text-body-text/50">No roles defined.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
