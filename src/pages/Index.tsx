
import React from "react";
import { WizardModal } from "@/components/WizardModal";
import { useWizardState } from "@/hooks/useWizardState";
import { AccentButton } from "@/components/ui/AccentButton";

const Index: React.FC = () => {
  const {
    state,
    setStep,
    setField,
    openWizard,
    closeWizard
  } = useWizardState();

  return (
    <div className="min-h-screen bg-background text-body-text flex items-center justify-center">
      <div className="w-full max-w-2xl px-2">
        <div className="card flex flex-col items-center text-center mt-10 shadow-lg">
          <h1 className="headline mb-3">Launch a Drop in 60 seconds.</h1>
          <AccentButton className="mt-5 w-full max-w-xs" onClick={openWizard}>
            Launch Wizard
          </AccentButton>
          <div className="mt-8 text-body-text text-base opacity-80 px-6">
            Type your project idea, set your Crew & Cut, press Mint & Fund.<br />
            You’ll receive a minted coin, AI art, and share-ready launch copy.
          </div>
        </div>
      </div>
      {/* Wizard modal (overlay) */}
      <WizardModal
        state={state}
        setField={setField}
        setStep={setStep}
        close={closeWizard}
      />
    </div>
  );
};

export default Index;
