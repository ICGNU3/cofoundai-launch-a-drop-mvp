
import React from "react";
import { ModeSelector } from "@/components/ui/ModeSelector";
import type { ProjectMode } from "@/hooks/useWizardState";

interface ModeSelectionSectionProps {
  mode: ProjectMode;
  onModeChange: (mode: ProjectMode) => void;
}

export const ModeSelectionSection: React.FC<ModeSelectionSectionProps> = ({
  mode,
  onModeChange,
}) => {
  return (
    <ModeSelector 
      mode={mode}
      onModeChange={onModeChange}
    />
  );
};
