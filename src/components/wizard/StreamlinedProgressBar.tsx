
import React from "react";

interface StreamlinedProgressBarProps {
  currentStep: number;
}

export const StreamlinedProgressBar: React.FC<StreamlinedProgressBarProps> = ({
  currentStep,
}) => {
  const steps = [
    { number: 1, title: "Project Basics" },
    { number: 2, title: "Team & Budget" },
    { number: 3, title: "Launch" },
  ];

  return (
    <div className="w-full">
      {/* Compact progress indicator */}
      <div className="flex items-center justify-between mb-2">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  currentStep >= step.number
                    ? "bg-accent text-black"
                    : "bg-background border border-border text-text/60"
                }`}
              >
                {step.number}
              </div>
              <span
                className={`ml-2 text-xs font-medium ${
                  currentStep >= step.number ? "text-text" : "text-text/60"
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-px bg-border mx-3"></div>
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Simple step indicator text */}
      <div className="text-xs text-text/70 text-center">
        Step {currentStep} of {steps.length}
      </div>
    </div>
  );
};
