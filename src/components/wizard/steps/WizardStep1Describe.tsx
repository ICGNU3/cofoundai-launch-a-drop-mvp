
import React from "react";
import type { StreamlinedWizardState } from "@/hooks/wizard/useStreamlinedWizard";
import { WalletConnectionWarning } from "./step1/WalletConnectionWarning";
import { InspirationCTA } from "./step1/InspirationCTA";
import { ProjectModeSection } from "./step1/ProjectModeSection";
import { ProjectDescriptionForm } from "./step1/ProjectDescriptionForm";
import { Step1Navigation } from "./step1/Step1Navigation";

interface WizardStep1DescribeProps {
  state: StreamlinedWizardState;
  updateField: <K extends keyof StreamlinedWizardState>(field: K, value: StreamlinedWizardState[K]) => void;
  nextStep: () => void;
  onShowInspiration: () => void;
  walletAddress: string | null;
}

export const WizardStep1Describe: React.FC<WizardStep1DescribeProps> = ({
  state,
  updateField,
  nextStep,
  onShowInspiration,
  walletAddress,
}) => {
  const [errors, setErrors] = React.useState<{
    projectIdea?: string;
    walletConnection?: string;
  }>({});

  const validateProjectIdea = (value: string) => {
    if (!value.trim()) {
      return "Project description is required";
    }
    if (value.trim().length < 10) {
      return "Project description must be at least 10 characters";
    }
    if (value.trim().length > 2000) {
      return "Project description cannot exceed 2000 characters";
    }
    return null;
  };

  const validateWalletConnection = () => {
    if (!walletAddress) {
      return "Please connect your wallet to continue";
    }
    return null;
  };

  const handleProjectIdeaChange = (value: string) => {
    updateField("projectIdea", value);
    const error = validateProjectIdea(value);
    setErrors(prev => ({ ...prev, projectIdea: error || undefined }));
  };

  const handleNext = () => {
    const projectIdeaError = validateProjectIdea(state.projectIdea);
    const walletError = validateWalletConnection();
    
    const newErrors = {
      projectIdea: projectIdeaError || undefined,
      walletConnection: walletError || undefined,
    };
    
    setErrors(newErrors);
    
    if (!projectIdeaError && !walletError) {
      nextStep();
    }
  };

  const canProceed = !errors.projectIdea && !errors.walletConnection && 
                    state.projectIdea.trim().length >= 10 && !!walletAddress;

  const handleModeChange = (mode: any) => {
    updateField("mode", mode);
    if (mode === "solo" && walletAddress) {
      updateField("roles", [{
        name: "Creator",
        percent: 100,
        percentNum: 100,
        percentStr: "100",
        address: walletAddress,
        isFixed: false,
      }]);
    }
  };

  return (
    <div className="p-3 sm:p-6 space-y-3 sm:space-y-6">
      <WalletConnectionWarning walletAddress={walletAddress} />
      
      <InspirationCTA onShowInspiration={onShowInspiration} />

      <ProjectModeSection 
        mode={state.mode}
        onModeChange={handleModeChange}
      />

      <ProjectDescriptionForm
        projectIdea={state.projectIdea}
        onProjectIdeaChange={handleProjectIdeaChange}
        projectType={state.projectType}
        onProjectTypeChange={(type) => updateField("projectType", type)}
        errors={errors}
      />

      <Step1Navigation
        onNext={handleNext}
        canProceed={canProceed}
      />
    </div>
  );
};
