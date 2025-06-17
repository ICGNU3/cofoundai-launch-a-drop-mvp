
import React from "react";

interface WizardProgressBarProps {
  totalSteps: number;
  progressStep: number;
}

export const WizardProgressBar: React.FC<WizardProgressBarProps> = ({
  totalSteps,
  progressStep,
}) => (
  <div className="px-4 sm:px-6 py-2 sm:py-3 border-b border-border">
    <div className="flex gap-1 sm:gap-2">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((stepNum) => (
        <div
          key={stepNum}
          className={`flex-1 h-1.5 sm:h-2 rounded-full transition-colors ${
            stepNum <= progressStep
              ? "bg-accent"
              : stepNum === progressStep + 1
              ? "bg-accent/30"
              : "bg-border"
          }`}
        />
      ))}
    </div>
  </div>
);
