
import React from "react";
import { WizardHeader } from "../WizardHeader";
import { WizardProgressBar } from "../WizardProgressBar";

interface WizardContainerProps {
  title: string;
  currentStep: number;
  totalSteps: number;
  onClose: () => void;
  children: React.ReactNode;
}

export const WizardContainer: React.FC<WizardContainerProps> = ({
  title,
  currentStep,
  totalSteps,
  onClose,
  children,
}) => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
    <div className="bg-card border border-border rounded-none sm:rounded-lg w-full max-w-none sm:max-w-4xl h-[100dvh] sm:h-[90vh] max-h-none sm:max-h-[600px] flex flex-col mx-auto">
      <WizardHeader 
        title={title} 
        currentStep={currentStep} 
        totalSteps={totalSteps} 
        onClose={onClose} 
      />
      <WizardProgressBar 
        totalSteps={totalSteps} 
        progressStep={currentStep}
      />
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  </div>
);
