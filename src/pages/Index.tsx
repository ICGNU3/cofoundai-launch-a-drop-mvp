
import React from "react";
import { WizardModal } from "@/components/WizardModal";
import { useWizardState } from "@/hooks/useWizardState";
import { AccentButton } from "@/components/ui/AccentButton";
import FullWaveBackground from "@/components/FullWaveBackground";

const Index: React.FC = () => {
  const wizard = useWizardState();

  return (
    <div className="min-h-screen bg-background text-body-text flex items-center justify-center relative overflow-x-hidden">
      <FullWaveBackground />
      <div className="w-full flex flex-col items-center px-2 z-10 relative">
        <div className="card flex flex-col items-center text-center mt-10 wizard-card shadow-lg bg-opacity-95 backdrop-blur-sm">
          <h1 className="hero-title headline mb-1">
            Drop a project in 90 seconds.
          </h1>
          <div className="hero-tagline tagline">
            Type your idea, assign every role and expense, tap Mint &amp; Fund.
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
