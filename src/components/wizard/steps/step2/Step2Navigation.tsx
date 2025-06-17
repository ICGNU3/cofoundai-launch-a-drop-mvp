
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface Step2NavigationProps {
  onBack: () => void;
  onNext: () => void;
  canProceed: boolean;
}

export const Step2Navigation: React.FC<Step2NavigationProps> = ({
  onBack,
  onNext,
  canProceed,
}) => {
  return (
    <>
      {/* Navigation */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="w-full sm:w-auto gap-2 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 flex-shrink-0" />
          <span className="hidden sm:inline">Back to Description</span>
          <span className="sm:hidden">Back</span>
        </Button>
        
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="w-full sm:w-auto bg-accent text-black hover:bg-accent/90 gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] sm:ml-auto"
        >
          <span className="hidden sm:inline">Continue to Launch</span>
          <span className="sm:hidden">Continue</span>
          <ArrowRight className="w-4 h-4 flex-shrink-0" />
        </Button>
      </div>

      {/* Help Text */}
      <div className="text-center text-xs text-text/50 border-t border-border pt-4">
        <p>You can adjust team and budget details after launching</p>
      </div>
    </>
  );
};
