
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
          <h1 className="text-center font-headline font-bold text-[36px] leading-[1.2] text-headline py-8">
            <span className="bg-gradient-to-r from-[#5D5FEF] to-[#9A4DFF] bg-clip-text text-transparent">
              Launch a Drop
            </span>{" "}
            in 90 seconds.
          </h1>
          <div className="hero-tagline tagline">
            Type your idea, assign every role and expense, tap Mint &amp; Fund.
          </div>
          <AccentButton 
            className="w-full mt-6 transform transition-transform duration-200 hover:scale-105" 
            onClick={wizard.openWizard}
          >
            Launch a Drop
          </AccentButton>
        </div>
      </div>
      
      <WizardModal
        isOpen={wizard.state.isWizardOpen}
        onClose={wizard.closeWizard}
        walletAddress={null}
      />
    </div>
  );
};

export default Index;
