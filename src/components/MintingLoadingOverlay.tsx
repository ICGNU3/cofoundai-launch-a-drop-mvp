
import React from "react";
import { Progress } from "./ui/progress";
import { Check, Loader2 } from "lucide-react";
import type { MintingStep } from "@/hooks/useMintingProcess";

interface MintingLoadingOverlayProps {
  isVisible: boolean;
  status: string;
  currentStep: MintingStep;
  progress: number;
  mintingSteps: Array<{
    key: string;
    label: string;
    description: string;
  }>;
}

export const MintingLoadingOverlay: React.FC<MintingLoadingOverlayProps> = ({
  isVisible,
  status,
  currentStep,
  progress,
  mintingSteps,
}) => {
  if (!isVisible) return null;

  const getStepStatus = (stepKey: string) => {
    const stepIndex = mintingSteps.findIndex(step => step.key === stepKey);
    const currentStepIndex = mintingSteps.findIndex(step => step.key === currentStep);
    
    if (stepIndex < currentStepIndex) return "completed";
    if (stepIndex === currentStepIndex) return "current";
    return "pending";
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="text-2xl font-bold text-headline mb-2">Launching Your Drop</div>
          <div className="text-body-text/70">{status}</div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-3" />
          <div className="text-center text-sm text-body-text/70 mt-2">
            {progress}% Complete
          </div>
        </div>

        {/* Step List */}
        <div className="space-y-4">
          {mintingSteps.map((step, index) => {
            const status = getStepStatus(step.key);
            
            return (
              <div key={step.key} className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                  status === "completed" 
                    ? "bg-green-500 border-green-500" 
                    : status === "current"
                    ? "border-accent bg-accent/20"
                    : "border-border bg-background"
                }`}>
                  {status === "completed" ? (
                    <Check size={12} className="text-white" />
                  ) : status === "current" ? (
                    <Loader2 size={12} className="text-accent animate-spin" />
                  ) : (
                    <span className="text-xs text-body-text/50">{index + 1}</span>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className={`font-medium ${
                    status === "completed" 
                      ? "text-green-400" 
                      : status === "current"
                      ? "text-accent"
                      : "text-body-text/50"
                  }`}>
                    {step.label}
                  </div>
                  <div className="text-sm text-body-text/70">
                    {step.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Animation */}
        <div className="flex justify-center mt-6">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};
