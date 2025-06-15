
import React from "react";

interface WizardProgressBarProps {
  totalSteps: number;
  progressStep: number;
}

export const WizardProgressBar: React.FC<WizardProgressBarProps> = ({
  totalSteps,
  progressStep,
}) => (
  <div className="px-6 py-3 border-b border-border">
    <div className="flex gap-2">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((stepNum) => (
        <div
          key={stepNum}
          className={`flex-1 h-2 rounded-full ${
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
