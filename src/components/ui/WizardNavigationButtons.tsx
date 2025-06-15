
import React from "react";
import { AccentButton } from "./AccentButton";

type WizardNavigationButtonsProps = {
  canProceed: boolean;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
};

export const WizardNavigationButtons: React.FC<WizardNavigationButtonsProps> = ({
  canProceed,
  onBack,
  onNext,
  nextLabel = "Next",
}) => {
  return (
    <div className="flex gap-2">
      <AccentButton
        secondary
        className="w-1/2"
        onClick={onBack}
        type="button"
      >
        ← Back
      </AccentButton>
      <AccentButton
        className="w-1/2"
        disabled={!canProceed}
        onClick={onNext}
        type="button"
      >
        {nextLabel}
      </AccentButton>
    </div>
  );
};
