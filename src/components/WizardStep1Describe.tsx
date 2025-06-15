
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SecureTextarea } from "@/components/ui/SecureTextarea";
import { ProjectTypeSelector } from "@/components/ui/ProjectTypeSelector";
import { useSecureForm } from "@/hooks/useSecureForm";
import { useWizardState } from "@/hooks/useWizardState";
import { projectContent } from "@/utils/contentSanitizer";

const WizardStep1Describe = () => {
  const { projectIdea, projectType, setProjectIdea, setProjectType } = useWizardState();

  const { values, errors, setValue, setTouched } = useSecureForm(
    { projectIdea, projectType },
    {
      projectIdea: {
        required: true,
        type: 'text',
        maxLength: 2000,
        custom: (value: string) => {
          if (value && value.trim().length < 10) {
            return { isValid: false, error: 'Project idea must be at least 10 characters long' };
          }
          return { isValid: true };
        }
      }
    }
  );

  const handleProjectIdeaChange = (value: string) => {
    const sanitized = projectContent.sanitizeProjectIdea(value);
    setValue('projectIdea', sanitized);
    setProjectIdea(sanitized);
  };

  const handleProjectTypeChange = (type: any) => {
    setValue('projectType', type);
    setProjectType(type);
  };

  return (
    <div className="space-y-6">
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
            value={values.projectIdea}
            onChange={handleProjectIdeaChange}
            onBlur={() => setTouched('projectIdea')}
            error={errors.projectIdea}
            placeholder="Describe your project idea, goals, and what makes it unique..."
            required
            maxLength={2000}
            rows={6}
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Project Type <span className="text-red-500">*</span>
            </label>
            <ProjectTypeSelector 
              value={projectType} 
              onChange={handleProjectTypeChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WizardStep1Describe;
