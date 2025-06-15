import React, { useState } from "react";
import { WizardModal } from "@/components/WizardModal";
import { useWizardState } from "@/hooks/useWizardState";
import { AccentButton } from "@/components/ui/AccentButton";
import FullWaveBackground from "@/components/FullWaveBackground";
import { Web3WalletModule } from "@/components/Web3WalletModule";
import { Wallet } from "lucide-react";
import LandingFeaturesSection from "@/components/LandingFeaturesSection";
import HeroMotionCanvas from "@/components/HeroMotionCanvas";

const Index: React.FC = () => {
  const wizard = useWizardState();
  const [walletOpen, setWalletOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-body-text flex flex-col items-center relative overflow-x-hidden">
      <FullWaveBackground />
      {/* --- HERO SECTION --- */}
      <div className="w-full pt-24 pb-10 px-4 z-10 relative flex flex-col items-center">
        {/* --- Hero Canvas Animation Layer (custom canvas, not SVG) --- */}
        <HeroMotionCanvas />
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
        <h1 className="text-center font-headline font-bold text-[2.5rem] md:text-[3rem] lg:text-[3.2rem] leading-[1.15] hero-title py-4 mt-4 max-w-3xl">
          Talent stalls when money is missing.
        </h1>
        <div className="hero-tagline tagline mb-4 max-w-xl text-lg md:text-xl text-success">
          CoFound AI unlocks funds in sixty seconds: mint a creator coin, lock fair splits, and stream cash to your crew the moment you hit Launch.
        </div>
        <AccentButton
          className="mt-4 sm:mt-6 px-8 py-4 text-lg rounded-xl shadow-lg hover:scale-105 transition-all"
          onClick={wizard.openWizard}
        >
          <span className="inline-flex items-center gap-2">
            <span className="text-gold">🌟</span> Launch a Drop <span className="text-gold">→</span>
          </span>
        </AccentButton>
      </div>

      {/* FEATURES SECTION */}
      <LandingFeaturesSection />

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
