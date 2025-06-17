
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ProjectTypeSelector } from "@/components/ui/ProjectTypeSelector";
import { AlertCircle } from "lucide-react";

interface ProjectDescriptionFormProps {
  projectIdea: string;
  onProjectIdeaChange: (value: string) => void;
  projectType: any;
  onProjectTypeChange: (type: any) => void;
  errors: {
    projectIdea?: string;
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
        <CardTitle className="text-base">Describe Your Project</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div>
          <label className="text-sm font-medium block mb-2">
            What's your creative vision? <span className="text-red-500">*</span>
          </label>
          <Textarea
            value={projectIdea}
            onChange={(e) => onProjectIdeaChange(e.target.value)}
            placeholder="Tell us about your project - what you're creating, your goals, and what makes it special..."
            rows={4}
            className={`resize-none ${errors.projectIdea ? 'border-red-500 focus:border-red-500' : ''}`}
          />
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2 gap-2">
            <div className="flex flex-col">
              <p className="text-xs text-text/60">
                Minimum 10 characters required
              </p>
              {errors.projectIdea && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  <span className="break-words">{errors.projectIdea}</span>
                </p>
              )}
            </div>
            <span className={`text-xs flex-shrink-0 ${
              projectIdea.length >= 10 ? "text-accent" : 
              projectIdea.length > 2000 ? "text-red-500" : "text-text/50"
            }`}>
              {projectIdea.length}/2000
            </span>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">Project Category</label>
          <div>
            <ProjectTypeSelector 
              projectType={projectType}
              onProjectTypeChange={onProjectTypeChange}
              onLoadDefaultRoles={() => {}} // Not used in streamlined flow
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
