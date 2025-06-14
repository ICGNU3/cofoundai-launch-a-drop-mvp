
import React from "react";
import { WizardModal } from "@/components/WizardModal";
import { useWizardState } from "@/hooks/useWizardState";
import { AccentButton } from "@/components/ui/AccentButton";
import GenerativeBanner from "@/components/GenerativeBanner";

const Index: React.FC = () => {
  const wizard = useWizardState();

  return (
    <div className="min-h-screen bg-background text-body-text flex items-center justify-center">
      <div className="w-full flex flex-col items-center px-2">
        <div className="card flex flex-col items-center text-center mt-10 wizard-card shadow-lg">
          <GenerativeBanner />
          <h1 className="hero-title headline mb-1">Launch a Drop in 60 seconds.</h1>
          <div className="hero-tagline tagline">
            Type your project idea, add each role & expense, press Mint & Fund.<br />
            Your drop mints with Zora Coins, generative cover, and share-ready copy in under 60 seconds.
          </div>
          <AccentButton className="mt-4 w-full max-w-xs" onClick={wizard.openWizard}>
            Launch Wizard
          </AccentButton>
        </div>
      </div>
      {/* Wizard modal (overlay) */}
      <WizardModal
        state={wizard.state}
        setField={wizard.setField}
        setStep={wizard.setStep}
        close={wizard.closeWizard}
        saveRole={wizard.saveRole}
        removeRole={wizard.removeRole}
        saveExpense={wizard.saveExpense}
        removeExpense={wizard.removeExpense}
        loadDefaultRoles={wizard.loadDefaultRoles}
      />
    </div>
  );
};

export default Index;
