
import React from "react";
import { AccentButton } from "./AccentButton";

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
    <div className="flex gap-2">
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
        Launch Project →
      </AccentButton>
    </div>
  );
};
