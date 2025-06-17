
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SecureTextarea } from "@/components/ui/SecureTextarea";

interface ProjectDescriptionFormProps {
  projectIdea: string;
  onProjectIdeaChange: (value: string) => void;
  projectType: string;
  onProjectTypeChange: (value: string) => void;
  errors: {
    projectIdea?: string;
    walletConnection?: string;
  };
}

export const ProjectDescriptionForm: React.FC<ProjectDescriptionFormProps> = ({
  projectIdea,
  onProjectIdeaChange,
  projectType,
  onProjectTypeChange,
  errors,
}) => {
  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-lg flex items-center gap-2 font-inter text-headline">
          ✨ Describe Your Project
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="space-y-2">
          <label className="text-sm font-medium text-headline font-inter">
            Project Type
          </label>
          <Select value={projectType} onValueChange={onProjectTypeChange}>
            <SelectTrigger className="w-full font-inter">
              <SelectValue placeholder="Select project type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="creative" className="font-inter">Creative Project</SelectItem>
              <SelectItem value="business" className="font-inter">Business Venture</SelectItem>
              <SelectItem value="community" className="font-inter">Community Initiative</SelectItem>
              <SelectItem value="product" className="font-inter">Product Development</SelectItem>
              <SelectItem value="research" className="font-inter">Research Project</SelectItem>
              <SelectItem value="other" className="font-inter">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <SecureTextarea
            id="project-idea"
            label="Project Description *"
            value={projectIdea}
            onChange={onProjectIdeaChange}
            error={errors.projectIdea}
            placeholder="Describe your project idea, goals, and what makes it unique..."
            required
            maxLength={2000}
            rows={6}
            className="font-inter"
          />
          <div className="text-xs text-tagline font-inter">
            {projectIdea.length}/2000 characters
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
