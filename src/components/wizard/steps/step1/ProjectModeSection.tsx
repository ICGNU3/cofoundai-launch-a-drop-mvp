
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModeSelector } from "@/components/ui/ModeSelector";

interface ProjectModeSectionProps {
  mode: any;
  onModeChange: (mode: any) => void;
}

export const ProjectModeSection: React.FC<ProjectModeSectionProps> = ({
  mode,
  onModeChange,
}) => {
  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-base">Project Mode</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ModeSelector 
          mode={mode}
          onModeChange={onModeChange}
        />
      </CardContent>
    </Card>
  );
};
