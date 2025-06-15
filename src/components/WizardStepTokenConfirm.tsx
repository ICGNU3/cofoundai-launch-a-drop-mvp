
import React from "react";

interface WizardStepTokenConfirmProps {
  doAdvancedToken: boolean;
  setDoAdvancedToken: (v: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

export const WizardStepTokenConfirm: React.FC<WizardStepTokenConfirmProps> = ({
  doAdvancedToken,
  setDoAdvancedToken,
  onNext,
  onBack,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12">
      <h2 className="text-xl font-bold mb-4">Customize Your Token?</h2>
      <p className="max-w-md text-center mb-6 text-body-text/80">
        Would you like to deeply customize your project's associated token—supply, distribution, vesting, and utility—or use a simple default token template? <span className="text-gold">Optional</span>
      </p>
      <div className="flex gap-4 mb-4">
        <button
          className={`accent-btn px-6 ${!doAdvancedToken ? "bg-accent border-accent text-background" : "bg-secondary border-border text-body-text"}`}
          type="button"
          aria-pressed={!doAdvancedToken}
          onClick={() => setDoAdvancedToken(false)}
        >
          No, use default token
        </button>
        <button
          className={`accent-btn px-6 ${doAdvancedToken ? "bg-accent border-accent text-background" : "bg-secondary border-border text-body-text"}`}
          type="button"
          aria-pressed={doAdvancedToken}
          onClick={() => setDoAdvancedToken(true)}
        >
          Yes, customize token
        </button>
      </div>
      <div className="flex justify-between mt-6 w-full max-w-xs">
        <button className="accent-btn secondary" type="button" onClick={onBack}>← Back</button>
        <button className="accent-btn" type="button" onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  );
};
