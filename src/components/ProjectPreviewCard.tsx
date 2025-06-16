
import React from "react";

interface ProjectPreviewCardProps {
  project: {
    id: string;
    name?: string;
    description?: string;
    created_at?: string;
    [key: string]: any;
  };
}

export const ProjectPreviewCard: React.FC<ProjectPreviewCardProps> = ({
  project,
}) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="font-semibold text-headline text-lg mb-2">
        {project.name || "Untitled Project"}
      </h3>
      {project.description && (
        <p className="text-text text-sm mb-4 line-clamp-3">
          {project.description}
        </p>
      )}
      <div className="flex justify-between items-center text-sm text-text/70">
        <span>Project ID: {project.id.slice(0, 8)}...</span>
        {project.created_at && (
          <span>
            Created: {new Date(project.created_at).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};
