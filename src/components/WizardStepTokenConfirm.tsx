
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
  const handleNext = () => {
    console.log("[WizardStepTokenConfirm] Proceeding with doAdvancedToken:", doAdvancedToken);
    onNext();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full py-8 md:py-12 px-4">
      <div className="w-full max-w-md text-center">
        <h2 className="text-lg md:text-xl font-bold mb-4">Customize Your Token?</h2>
        <p className="text-sm md:text-base text-center mb-6 text-body-text/80">
          Would you like to deeply customize your project's associated token—supply, distribution, vesting, and utility—or use a simple default token template? <span className="text-gold">Optional</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <button
            className={`px-4 md:px-6 py-3 rounded-lg border-2 transition-all text-sm md:text-base font-semibold ${
              !doAdvancedToken 
                ? "bg-accent border-accent text-background" 
                : "bg-black border-gray-600 text-body-text hover:border-accent/50"
            }`}
            type="button"
            aria-pressed={!doAdvancedToken}
            onClick={() => {
              console.log("[WizardStepTokenConfirm] Setting doAdvancedToken to false");
              setDoAdvancedToken(false);
            }}
          >
            No, use default token
          </button>
          <button
            className={`px-4 md:px-6 py-3 rounded-lg border-2 transition-all text-sm md:text-base font-semibold ${
              doAdvancedToken 
                ? "bg-accent border-accent text-background" 
                : "bg-black border-gray-600 text-body-text hover:border-accent/50"
            }`}
            type="button"
            aria-pressed={doAdvancedToken}
            onClick={() => {
              console.log("[WizardStepTokenConfirm] Setting doAdvancedToken to true");
              setDoAdvancedToken(true);
            }}
          >
            Yes, customize token
          </button>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-3 w-full">
          <button className="accent-btn secondary px-4 md:px-6 py-3 text-sm md:text-base" type="button" onClick={onBack}>← Back</button>
          <button className="accent-btn px-4 md:px-6 py-3 text-sm md:text-base" type="button" onClick={handleNext}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
