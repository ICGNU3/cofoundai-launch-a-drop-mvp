
import React from "react";
import { AccentButton } from "./ui/AccentButton";
import type { ProjectType, WizardStateData } from "@/hooks/useWizardState";

interface WizardStep1DescribeProps {
  projectIdea: string;
  projectType: ProjectType;
  onSetField: <K extends keyof WizardStateData>(k: K, v: WizardStateData[K]) => void;
  onLoadDefaultRoles: (type: ProjectType) => void;
  canProceed: boolean;
  onNext: () => void;
}

export const WizardStep1Describe: React.FC<WizardStep1DescribeProps> = ({
  projectIdea,
  projectType,
  onSetField,
  onLoadDefaultRoles,
  canProceed,
  onNext,
}) => {
  return (
    <div className="p-6 space-y-4 h-full overflow-y-auto">
      <div>
        <h2 className="text-2xl font-bold text-headline mb-2">Describe Your Project</h2>
        <p className="text-body-text/70">
          Tell us about your creative project idea.
        </p>
      </div>
      
      <textarea
        className="w-full p-3 border border-border rounded-lg bg-card text-body-text resize-none min-h-[120px]"
        value={projectIdea}
        maxLength={256}
        onChange={e => onSetField("projectIdea", e.target.value)}
        placeholder="Three-track lo-fi EP with dreamy soundscapes..."
      />
      
      <div className="text-sm text-body-text/60 text-right">
        {projectIdea.length}/256 characters
      </div>
      
      <AccentButton 
        className="w-full" 
        onClick={onNext}
        disabled={!canProceed}
      >
        Next: Define Roles →
      </AccentButton>
    </div>
  );
};
