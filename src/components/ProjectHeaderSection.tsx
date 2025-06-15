
import React from "react";

interface ProjectHeaderSectionProps {
  projectName: string;
  projectType: string;
  isNewlyLaunched: boolean;
  isLoading: boolean;
  onRefresh: () => void;
  projectIdea: string;
}

export const ProjectHeaderSection: React.FC<ProjectHeaderSectionProps> = ({
  projectName,
  projectType,
  isNewlyLaunched,
  isLoading,
  onRefresh,
  projectIdea,
}) => (
  <div className="mb-6">
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-3xl font-bold text-headline">
        {isNewlyLaunched ? "Project Launch Hub" : "Project Dashboard"}
      </h1>
      <button
        onClick={onRefresh}
        className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition"
        disabled={isLoading}
      >
        Refresh
      </button>
    </div>
    <div className="mb-4">
      <h2 className="text-xl font-semibold text-body-text mb-2">{projectIdea}</h2>
      <span className="text-sm text-body-text/70">{projectType}</span>
    </div>
  </div>
);
