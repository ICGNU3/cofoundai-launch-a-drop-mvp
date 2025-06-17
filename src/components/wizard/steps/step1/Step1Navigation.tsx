
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface Step1NavigationProps {
  onNext: () => void;
  canProceed: boolean;
}

export const Step1Navigation: React.FC<Step1NavigationProps> = ({
  onNext,
  canProceed,
}) => {
  return (
    <>
      {/* Navigation */}
      <div className="flex justify-end pt-4">
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="w-full sm:w-auto bg-accent text-black hover:bg-accent/90 gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
        >
          <span className="hidden sm:inline">Continue to Team & Budget</span>
          <span className="sm:hidden">Continue</span>
          <ArrowRight className="w-4 h-4 flex-shrink-0" />
        </Button>
      </div>

      {/* Help Text */}
      <div className="text-center text-xs text-text/50 border-t border-border pt-4">
        <p>Don't worry, you can always edit these details later</p>
      </div>
    </>
  );
};
