
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { ProjectMode } from "@/hooks/useWizardState";

interface ModeSelectorProps {
  mode: ProjectMode;
  onModeChange: (mode: ProjectMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  mode,
  onModeChange,
}) => {
  return (
    <div className="flex items-center space-x-3 p-3 border border-border rounded-lg bg-card/50">
      <Label htmlFor="mode-toggle" className="text-sm font-medium">
        Solo Mode
      </Label>
      <Switch
        id="mode-toggle"
        checked={mode === "team"}
        onCheckedChange={(checked) => onModeChange(checked ? "team" : "solo")}
      />
      <Label htmlFor="mode-toggle" className="text-sm font-medium">
        Team Mode
      </Label>
      <div className="ml-4 text-xs text-body-text/60">
        {mode === "solo" ? "Create alone with 100% ownership" : "Build with a team and split revenue"}
      </div>
    </div>
  );
};
