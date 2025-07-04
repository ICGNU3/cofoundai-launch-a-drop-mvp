
import React from "react";
import { WizardNavigationButtons } from "@/components/ui/WizardNavigationButtons";
import { useSecureForm } from "@/hooks/useSecureForm";
import { projectContent } from "@/utils/contentSanitizer";
import { ProjectIdeaSection } from "./wizard/step1/ProjectIdeaSection";
import { ProjectTypeSection } from "./wizard/step1/ProjectTypeSection";
import { ModeSelectionSection } from "./wizard/step1/ModeSelectionSection";
import type { WizardStateData, ProjectType, ProjectMode } from "@/hooks/useWizardState";

interface WizardStep1DescribeProps {
  projectIdea: string;
  projectType: ProjectType;
  mode: ProjectMode;
  walletAddress: string | null;
  onSetField: <K extends keyof WizardStateData>(k: K, v: WizardStateData[K]) => void;
  onSetMode: (mode: ProjectMode, walletAddress?: string) => void;
  onLoadDefaultRoles: (type: ProjectType) => void;
  canProceed: boolean;
  onNext: () => void;
}

const WizardStep1Describe: React.FC<WizardStep1DescribeProps> = ({
  projectIdea,
  projectType,
  mode,
  walletAddress,
  onSetField,
  onSetMode,
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

  const handleModeChange = (newMode: ProjectMode) => {
    onSetMode(newMode, walletAddress || "");
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-6 pb-4">
          <ModeSelectionSection 
            mode={mode}
            onModeChange={handleModeChange}
          />
          
          <ProjectIdeaSection
            projectIdea={values.projectIdea}
            onProjectIdeaChange={handleProjectIdeaChange}
            onBlur={() => setTouched('projectIdea')}
            error={errors.projectIdea}
          />
          
          <ProjectTypeSection
            projectType={values.projectType}
            onProjectTypeChange={handleProjectTypeChange}
            onLoadDefaultRoles={onLoadDefaultRoles}
          />
          
          <div className="h-20" />
        </div>
      </div>
      
      <div className="border-t border-border p-4 bg-card flex-shrink-0">
        <WizardNavigationButtons
          canProceed={canProceed}
          onBack={() => {}}
          onNext={onNext}
          nextLabel="Next"
        />
      </div>
    </div>
  );
};

export default WizardStep1Describe;
