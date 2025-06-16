
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SecureTextarea } from "@/components/ui/SecureTextarea";

interface ProjectIdeaSectionProps {
  projectIdea: string;
  onProjectIdeaChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
}

export const ProjectIdeaSection: React.FC<ProjectIdeaSectionProps> = ({
  projectIdea,
  onProjectIdeaChange,
  onBlur,
  error,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          ✨ Describe Your Creative Project
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <SecureTextarea
          id="project-idea"
          label="What's your creative vision?"
          value={projectIdea}
          onChange={onProjectIdeaChange}
          onBlur={onBlur}
          error={error}
          placeholder="Describe your project idea, goals, and what makes it unique..."
          required
          maxLength={2000}
          rows={6}
        />
      </CardContent>
    </Card>
  );
};
