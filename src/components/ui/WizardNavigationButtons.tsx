
import React from "react";
import { AccentButton } from "./AccentButton";
import type { WizardStep } from "@/hooks/useWizardState";

type WizardNavigationButtonsProps = {
  canProceed: boolean;
  onBack: () => void;
  onNext: () => void;
};

export const WizardNavigationButtons: React.FC<WizardNavigationButtonsProps> = ({
  canProceed,
  onBack,
  onNext,
}) => {
  return (
    <div className="flex gap-2 mt-2">
      <AccentButton
        secondary
        className="w-1/2"
        onClick={onBack}
      >
        ← Back
      </AccentButton>
      <AccentButton
        className="w-1/2"
        disabled={!canProceed}
        onClick={onNext}
      >
        Next: Expenses →
      </AccentButton>
    </div>
  );
};
