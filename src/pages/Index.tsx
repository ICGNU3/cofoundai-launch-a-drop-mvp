import React, { useState, useEffect, useRef } from "react";
import { WizardModal } from "@/components/WizardModal";
import { useWizardState } from "@/hooks/useWizardState";
import { AccentButton } from "@/components/ui/AccentButton";
import FullWaveBackground from "@/components/FullWaveBackground";
import { Web3WalletModule } from "@/components/Web3WalletModule";
import { Wallet } from "lucide-react";
import LandingFeaturesSection from "@/components/LandingFeaturesSection";
import AdvancedTokenCustomization from "@/components/AdvancedTokenCustomization/AdvancedTokenCustomization";
import CreatorCarousel from "@/components/CreatorCarousel";
import LiveCounterBar from "@/components/LiveCounterBar";
import CrewSplitSliderDemo from "@/components/CrewSplitSliderDemo";

// Import Avatar for carousel
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Index: React.FC = () => {
  const wizard = useWizardState();
  const [walletOpen, setWalletOpen] = useState(false);
  const [tokenModalOpen, setTokenModalOpen] = useState(false);

  // Live counter state
  const [counter, setCounter] = useState<{ total: number; drops: number }>({ total: 0, drops: 0 });

  // Latest projects for creator carousel
  const [carousel, setCarousel] = useState<any[]>([]);

  // Fetch stats (Edge function) and projects (from supabase)
  useEffect(() => {
    // Fetch stats
    fetch("/functions/v1/stats")
      .then(r => r.json())
      .then(json => setCounter(json))
      .catch(() => setCounter({ total: 234500, drops: 98 })); // fallback placeholder
    // Fetch latest 3 completed projects
    fetch("/rest/v1/projects?status=eq.complete&order=minted_at.desc&limit=3", {
      headers: { "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY as string }
    })
      .then(r => r.json())
      .then(setCarousel)
      .catch(() => setCarousel([]));
  }, []);

  // Animate counters when value changes (CountUp.js required)
  useEffect(() => {
    // Add CountUp.js if missing
    if (!window.CountUp) {
      const c = document.createElement("script");
      c.src = "https://cdn.jsdelivr.net/npm/countup.js@2.6.2/dist/countUp.min.js";
      c.onload = () => {
        if (window.CountUp) runCounter();
      };
      document.body.appendChild(c);
    } else {
      runCounter();
    }
    function runCounter() {
      // @ts-ignore
      const dollar = new window.CountUp(countUpDollarRef.current, counter.total, { prefix: "$", duration: 1.1, separator: "," });
      // @ts-ignore
      const drops = new window.CountUp(countUpDropRef.current, counter.drops, { duration: 1.0 });
      dollar?.start();
      drops?.start();
    }
  }, [counter]);

  // Confetti for slider
  useEffect(() => {
    if (!window.confetti) {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/canvas-confetti";
      document.body.appendChild(s);
    }
  }, []);

  function handleSliderChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = +e.target.value;
    if (val === 100 && window.confetti) {
      // @ts-ignore
      window.confetti({ particleCount: 60, spread: 55, origin: { y: 0.6 } });
    }
  }

  // Optionally: carousel auto-scroll
  // (Removed - this logic is now handled inside CreatorCarousel, so no need for carouselRef here)

  return (
    <div className="min-h-screen bg-background text-body-text flex flex-col items-center relative overflow-x-hidden">
      <FullWaveBackground />
      <section className="relative w-full pt-16 md:pt-20 pb-10 px-4 z-10 flex flex-col items-center pb-24">
        {/* HERO GRADIENT */}
        <div className="hero-gradient pointer-events-none" aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 80%,rgba(154,77,255,.35) 0%,transparent 70%)', zIndex: 0 }} />
        <div className="w-full max-w-5xl flex justify-end">
          <button
            onClick={() => setWalletOpen(true)}
            className="rounded-lg p-2 bg-gold/15 hover:bg-accent/30 text-accent transition-all"
            aria-label="Open Wallet"
          >
            <Wallet size={20} color="#FFD700" />
          </button>
        </div>
        <h1 className="text-center font-headline font-bold text-[2.5rem] md:text-[3rem] lg:text-[3.2rem] leading-[1.15] hero-title py-2 mt-2 max-w-3xl relative z-10">
          TALENT = MONEY
        </h1>
        {/* Sub-headline without em dash and emojis */}
        <div className="text-lg text-[#E0E0E0] mt-4 max-w-xl mx-auto font-medium text-center">
          Build and fund creative projects with your team. Experience instant streaming of funds as soon as you deliver.
        </div>
        {/* --- LIVE COUNTER BAR --- */}
        <LiveCounterBar counter={counter} />
        {/* HERO CTA BUTTON */}
        <AccentButton
          className="hero-cta mt-6 sm:mt-7 px-8 py-4 text-lg rounded-xl shadow-lg hover:scale-105 transition-all font-bold z-20"
          style={{ background: 'linear-gradient(90deg,#5D5FEF 0%,#9A4DFF 100%)', boxShadow: '0 0 16px rgba(93,95,239,.6)' }}
          onClick={wizard.openWizard}
          aria-label="Launch a Drop"
        >
          <span className="inline-flex items-center gap-2">
            Launch a Drop
          </span>
        </AccentButton>
        {/* NEW: Advanced Token Customization */}
        <AccentButton
          className="mt-2 px-8 py-3 text-base rounded-xl shadow-md bg-indigo-900/80 border-2 border-accent hover:bg-accent/90 transition"
          onClick={() => setTokenModalOpen(true)}
        >
          <span className="inline-flex items-center gap-2">
            Advanced Token Customization
          </span>
        </AccentButton>
        {/* CREATOR CAROUSEL */}
        <CreatorCarousel carousel={carousel} />
      </section>

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
