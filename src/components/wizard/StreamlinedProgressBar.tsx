
import React from "react";
import { CheckCircle, Circle, ArrowRight } from "lucide-react";

interface Step {
  number: number;
  title: string;
  description: string;
  isComplete: boolean;
  isCurrent: boolean;
}

interface StreamlinedProgressBarProps {
  currentStep: 1 | 2 | 3;
}

export const StreamlinedProgressBar: React.FC<StreamlinedProgressBarProps> = ({
  currentStep,
}) => {
  const steps: Step[] = [
    {
      number: 1,
      title: "Project Basics",
      description: "Describe your creative vision",
      isComplete: currentStep > 1,
      isCurrent: currentStep === 1,
    },
    {
      number: 2,
      title: "Team & Budget",
      description: "Set up roles and expenses",
      isComplete: currentStep > 2,
      isCurrent: currentStep === 2,
    },
    {
      number: 3,
      title: "Launch",
      description: "Configure and launch your drop",
      isComplete: currentStep > 3,
      isCurrent: currentStep === 3,
    },
  ];

  return (
    <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border bg-card/50">
      {/* Desktop Progress Bar */}
      <div className="hidden sm:flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center min-w-0 flex-1">
              <div className="flex items-center mb-2">
                {step.isComplete ? (
                  <CheckCircle className="w-8 h-8 text-accent" />
                ) : step.isCurrent ? (
                  <div className="w-8 h-8 bg-accent text-black rounded-full flex items-center justify-center font-bold">
                    {step.number}
                  </div>
                ) : (
                  <Circle className="w-8 h-8 text-border" />
                )}
              </div>
              <div className="text-center">
                <div className={`text-sm font-medium ${
                  step.isCurrent ? "text-accent" : 
                  step.isComplete ? "text-text" : "text-text/50"
                }`}>
                  {step.title}
                </div>
                <div className="text-xs text-text/60 mt-1">
                  {step.description}
                </div>
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <ArrowRight className="w-4 h-4 text-border mx-2 flex-shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Mobile Progress Bar */}
      <div className="sm:hidden">
        {/* Simple step indicator */}
        <div className="flex items-center justify-center gap-2 mb-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                step.isComplete
                  ? "bg-accent text-black"
                  : step.isCurrent
                  ? "bg-accent text-black"
                  : "bg-border text-text/50"
              }`}
            >
              {step.isComplete ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                step.number
              )}
            </div>
          ))}
        </div>
        
        {/* Current step info */}
        <div className="text-center">
          <div className="text-sm font-medium text-accent">
            {steps[currentStep - 1].title}
          </div>
          <div className="text-xs text-text/60 mt-1">
            Step {currentStep} of 3: {steps[currentStep - 1].description}
          </div>
        </div>
      </div>
    </div>
  );
};
