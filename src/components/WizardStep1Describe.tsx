
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
    <div className="p-4 md:p-6 space-y-4 h-full overflow-y-auto flex flex-col">
      <div className="text-center">
        <h2 className="text-xl md:text-2xl font-bold text-headline mb-2">Describe Your Project</h2>
        <p className="text-body-text/70 text-sm md:text-base">
          Tell us about your creative project idea.
        </p>
      </div>
      
      <div className="flex-1 flex flex-col">
        <textarea
          className="w-full p-3 border border-border rounded-lg bg-card text-body-text resize-none min-h-[120px] md:min-h-[150px] text-sm md:text-base"
          value={projectIdea}
          maxLength={256}
          onChange={e => onSetField("projectIdea", e.target.value)}
          placeholder="Three-track lo-fi EP with dreamy soundscapes..."
        />
        
        <div className="text-xs md:text-sm text-body-text/60 text-right mt-2">
          {projectIdea.length}/256 characters
        </div>
      </div>
      
      <div className="pt-4">
        <AccentButton 
          className="w-full max-w-sm mx-auto block" 
          onClick={onNext}
          disabled={!canProceed}
        >
          Next: Define Roles →
        </AccentButton>
      </div>
    </div>
  );
};
