
import React from "react";
import type { ProjectType } from "@/hooks/useWizardState";

const projectTypes: ProjectType[] = ["Music", "Film", "Fashion", "Art", "Other"];

type ProjectTypeSelectorProps = {
  projectType: ProjectType;
  onProjectTypeChange: (type: ProjectType) => void;
  onLoadDefaultRoles: (type: ProjectType) => void;
};

export const ProjectTypeSelector: React.FC<ProjectTypeSelectorProps> = ({
  projectType,
  onProjectTypeChange,
  onLoadDefaultRoles,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as ProjectType;
    onProjectTypeChange(type);
    onLoadDefaultRoles(type);
  };

  return (
    <div>
      <label className="block mb-2 text-body-text font-semibold">Project Type</label>
      <select
        className="w-full mb-2"
        value={projectType}
        onChange={handleChange}
      >
        {projectTypes.map(type => (
          <option value={type} key={type}>{type}</option>
        ))}
      </select>
    </div>
  );
};
