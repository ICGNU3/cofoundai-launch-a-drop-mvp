
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Users } from "lucide-react";

interface ProjectModeSectionProps {
  mode: string;
  onModeChange: (mode: string) => void;
}

export const ProjectModeSection: React.FC<ProjectModeSectionProps> = ({
  mode,
  onModeChange,
}) => {
  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-lg font-inter text-headline">
          Choose Your Project Mode
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant={mode === "solo" ? "default" : "outline"}
            onClick={() => onModeChange("solo")}
            className="h-auto p-4 flex flex-col items-start gap-2 font-inter"
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="font-medium">Solo Creator</span>
            </div>
            <span className="text-xs text-left opacity-80">
              You own 100% of the project
            </span>
          </Button>
          
          <Button
            variant={mode === "team" ? "default" : "outline"}
            onClick={() => onModeChange("team")}
            className="h-auto p-4 flex flex-col items-start gap-2 font-inter"
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="font-medium">Team Project</span>
            </div>
            <span className="text-xs text-left opacity-80">
              Share ownership with collaborators
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
