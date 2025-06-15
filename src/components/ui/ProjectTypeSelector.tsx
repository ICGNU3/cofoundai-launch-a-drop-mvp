
import React from "react";
import type { ProjectType } from "@/hooks/useWizardState";
import { useToast } from "@/hooks/use-toast";

const projectTypes: ProjectType[] = ["Music", "Film", "Fashion", "Art", "Other"];

type ProjectTypeSelectorProps = {
  projectType: ProjectType;
  onProjectTypeChange: (type: ProjectType) => void;
  loadDefaultRoles: (type: ProjectType) => void;
};

export const ProjectTypeSelector: React.FC<ProjectTypeSelectorProps> = ({
  projectType,
  onProjectTypeChange,
  loadDefaultRoles,
}) => {
  const { toast } = useToast();

  const handleProjectTypeChange = (newType: ProjectType) => {
    onProjectTypeChange(newType);
    loadDefaultRoles(newType);
    
    toast({
      title: "Project Type Changed",
      description: `Loaded default roles for ${newType} projects`,
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="block mb-1 text-body-text font-semibold">
        Project Type
      </label>
      <select
        className="w-full mb-2"
        value={projectType}
        onChange={e => handleProjectTypeChange(e.target.value as ProjectType)}
      >
        {projectTypes.map(type => (
          <option value={type} key={type}>{type}</option>
        ))}
      </select>
    </div>
  );
};
