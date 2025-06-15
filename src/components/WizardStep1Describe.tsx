import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SecureTextarea } from "@/components/ui/SecureTextarea";
import { ProjectTypeSelector } from "@/components/ui/ProjectTypeSelector";
import { useSecureForm } from "@/hooks/useSecureForm";
import { projectContent } from "@/utils/contentSanitizer";
import type { WizardStateData, ProjectType } from "@/hooks/useWizardState";

interface WizardStep1DescribeProps {
  projectIdea: string;
  projectType: ProjectType;
  onSetField: <K extends keyof WizardStateData>(k: K, v: WizardStateData[K]) => void;
  onLoadDefaultRoles: (type: ProjectType) => void;
  canProceed: boolean;
  onNext: () => void;
}

const WizardStep1Describe: React.FC<WizardStep1DescribeProps> = ({
  projectIdea,
  projectType,
  onSetField,
  onLoadDefaultRoles,
  canProceed,
  onNext
}) => {
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
    onSetField('projectIdea', sanitized);
  };

  const handleProjectTypeChange = (type: ProjectType) => {
    setValue('projectType', type);
    onSetField('projectType', type);
    onLoadDefaultRoles(type);
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
              projectType={projectType} 
              onProjectTypeChange={handleProjectTypeChange}
              onLoadDefaultRoles={onLoadDefaultRoles}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WizardStep1Describe;
