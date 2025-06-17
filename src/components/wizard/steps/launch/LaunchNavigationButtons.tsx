
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap, Loader2 } from "lucide-react";

interface LaunchNavigationButtonsProps {
  onPrevStep: () => void;
  onLaunch: () => void;
  allValidationsPassed: boolean;
  isLaunching: boolean;
  isMinting: boolean;
}

export const LaunchNavigationButtons: React.FC<LaunchNavigationButtonsProps> = ({
  onPrevStep,
  onLaunch,
  allValidationsPassed,
  isLaunching,
  isMinting,
}) => {
  return (
    <div className="flex justify-between pt-4">
      <Button 
        variant="outline" 
        onClick={onPrevStep} 
        className="gap-2"
        disabled={isLaunching || isMinting}
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>
      <Button
        onClick={onLaunch}
        className="bg-accent text-black hover:bg-accent/90 gap-2"
        disabled={!allValidationsPassed || isLaunching || isMinting}
      >
        {isLaunching || isMinting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Zap className="w-4 h-4" />
        )}
        {isLaunching || isMinting ? "Launching..." : "Launch Project"}
      </Button>
    </div>
  );
};
