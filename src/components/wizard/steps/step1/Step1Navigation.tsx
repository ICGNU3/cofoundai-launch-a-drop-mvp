
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
          className="bg-accent text-black hover:bg-accent/90 gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] font-inter"
        >
          Continue to Team & Budget
          <ArrowRight className="w-4 h-4 flex-shrink-0" />
        </Button>
      </div>

      {/* Help Text */}
      <div className="text-center text-xs text-tagline border-t border-border pt-4 font-inter">
        <p>You can refine your project details in the next steps</p>
      </div>
    </>
  );
};
