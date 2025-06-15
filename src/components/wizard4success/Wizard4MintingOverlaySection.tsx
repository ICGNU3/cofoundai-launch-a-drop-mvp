
import React from "react";
import { MintingLoadingOverlay } from "../MintingLoadingOverlay";
import type { MintingStep } from "@/hooks/useMintingProcess";

interface Wizard4MintingOverlaySectionProps {
  isMinting: boolean;
  mintingStatus: string;
  currentStep: MintingStep;
  progress: number;
  mintingSteps: Array<{
    key: string;
    label: string;
    description: string;
  }>;
}

export const Wizard4MintingOverlaySection: React.FC<Wizard4MintingOverlaySectionProps> = ({
  isMinting,
  mintingStatus,
  currentStep,
  progress,
  mintingSteps,
}) => (
  <MintingLoadingOverlay 
    isVisible={isMinting} 
    status={mintingStatus}
    currentStep={currentStep}
    progress={progress}
    mintingSteps={mintingSteps}
  />
);
