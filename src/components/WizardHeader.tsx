
import React from "react";
import { X } from "lucide-react";

interface WizardHeaderProps {
  title: string;
  currentStep: number;
  totalSteps: number;
  onClose: () => void;
}

export const WizardHeader: React.FC<WizardHeaderProps> = ({
  title,
  currentStep,
  totalSteps,
  onClose,
}) => (
  <div className="flex items-center justify-between p-6 border-b border-border">
    <div>
      <h2 className="text-2xl font-bold text-headline">{title}</h2>
      <div className="text-sm text-body-text/70 mt-1">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
    <button
      onClick={onClose}
      className="text-body-text/60 hover:text-body-text transition-colors"
    >
      <X size={24} />
    </button>
  </div>
);
