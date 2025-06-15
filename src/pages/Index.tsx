import React, { useState } from "react";
import { WizardModal } from "@/components/WizardModal";
import { useWizardState } from "@/hooks/useWizardState";
import { AccentButton } from "@/components/ui/AccentButton";
import FullWaveBackground from "@/components/FullWaveBackground";
import { Web3WalletModule } from "@/components/Web3WalletModule";
import { Wallet } from "lucide-react";
import LandingFeaturesSection from "@/components/LandingFeaturesSection";
import AdvancedTokenCustomization from "@/components/AdvancedTokenCustomization/AdvancedTokenCustomization";

const Index: React.FC = () => {
  const wizard = useWizardState();
  const [walletOpen, setWalletOpen] = useState(false);

  // State to control Token Customization modal
  const [tokenModalOpen, setTokenModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-body-text flex flex-col items-center relative overflow-x-hidden">
      <FullWaveBackground />
      {/* --- HERO SECTION --- */}
      <div className="w-full pt-16 md:pt-20 pb-10 px-4 z-10 relative flex flex-col items-center">
        {/* Wallet button right-aligned (desktop), mobile top-right */}
        <div className="w-full max-w-5xl flex justify-end">
          <button
            onClick={() => setWalletOpen(true)}
            className="rounded-lg p-2 bg-gold/15 hover:bg-accent/30 text-accent transition-all"
            aria-label="Open Wallet"
          >
            <Wallet size={20} color="#FFD700" />
          </button>
        </div>
        <h1 className="text-center font-headline font-bold text-[2.5rem] md:text-[3rem] lg:text-[3.2rem] leading-[1.15] hero-title py-2 mt-2 max-w-3xl">
          TALENT &gt; MONEY
        </h1>
        <div className="hero-tagline tagline mb-4 max-w-xl w-full text-lg md:text-xl text-success text-center mx-auto">
          Launch your project, mint the funds, stream the payouts.
        </div>
        <AccentButton
          className="mt-4 sm:mt-6 px-8 py-4 text-lg rounded-xl shadow-lg hover:scale-105 transition-all"
          onClick={wizard.openWizard}
        >
          <span className="inline-flex items-center gap-2">
            <span className="text-gold">🌟</span> Launch a Drop <span className="text-gold">→</span>
          </span>
        </AccentButton>
        {/* NEW: Button to open Advanced Token Customization */}
        <AccentButton
          className="mt-2 px-8 py-3 text-base rounded-xl shadow-md bg-indigo-900/80 border-2 border-accent hover:bg-accent/90 transition"
          onClick={() => setTokenModalOpen(true)}
        >
          <span className="inline-flex items-center gap-2">
            <span className="text-gold">🪙</span> Advanced Token Customization
          </span>
        </AccentButton>
      </div>

      {/* FEATURES SECTION */}
      <LandingFeaturesSection />

      {/* Modal for Advanced Token Customization */}
      {tokenModalOpen && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="relative w-full max-w-2xl">
            <div className="absolute top-3 right-3 z-50">
              <button
                onClick={() => setTokenModalOpen(false)}
                className="bg-card text-body-text/70 rounded-full p-1 border border-border shadow hover:text-accent"
                aria-label="Close"
              >✕</button>
            </div>
            <div className="bg-surface border border-border rounded-xl shadow-2xl p-4 overflow-y-auto max-h-[90vh]">
              <AdvancedTokenCustomization />
            </div>
          </div>
        </div>
      )}

      <WizardModal
        isOpen={wizard.state.isWizardOpen}
        onClose={wizard.closeWizard}
        walletAddress={null}
      />
      <Web3WalletModule open={walletOpen} onClose={() => setWalletOpen(false)} />
    </div>
  );
};

export default Index;
