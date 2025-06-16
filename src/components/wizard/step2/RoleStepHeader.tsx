
import React from "react";
import type { ProjectMode } from "@/hooks/useWizardState";

interface RoleStepHeaderProps {
  mode: ProjectMode;
}

export const RoleStepHeader: React.FC<RoleStepHeaderProps> = ({ mode }) => {
  return (
    <h2 className="headline text-center mb-2">
      {mode === "solo" ? "Solo Creator" : "Crew & Cut"}
    </h2>
  );
};
