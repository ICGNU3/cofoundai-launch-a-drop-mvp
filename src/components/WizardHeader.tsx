
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
  <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
    <div className="min-w-0 flex-1 pr-2">
      <h2 className="text-lg sm:text-2xl font-bold text-headline truncate">{title}</h2>
      <div className="text-xs sm:text-sm text-body-text/70 mt-1">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
    <button
      onClick={onClose}
      className="text-body-text/60 hover:text-body-text transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0"
    >
      <X size={20} className="sm:w-6 sm:h-6" />
    </button>
  </div>
);
