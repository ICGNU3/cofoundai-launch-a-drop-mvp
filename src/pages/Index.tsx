import React, { useState, useEffect, useRef } from "react";
import { WizardModal } from "@/components/WizardModal";
import { useWizardState } from "@/hooks/useWizardState";
import { AccentButton } from "@/components/ui/AccentButton";
import FullWaveBackground from "@/components/FullWaveBackground";
import { Web3WalletModule } from "@/components/Web3WalletModule";
import { Wallet } from "lucide-react";
import LandingFeaturesSection from "@/components/LandingFeaturesSection";
import CreatorCarousel from "@/components/CreatorCarousel";
import LiveCounterBar from "@/components/LiveCounterBar";
// Import LogoRow!
import LogoRow from "@/components/LogoRow";
// Import Avatar for carousel
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// Add missing import for AdvancedTokenCustomization
import AdvancedTokenCustomization from "@/components/AdvancedTokenCustomization/AdvancedTokenCustomization";

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

  // For live metrics in hero
  const liveMetrics = (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-3 text-success font-mono text-lg font-bold mb-1 select-none">
      <span className="sm:border-r sm:border-[#45e36e88] pr-4">
        ${counter.total.toLocaleString()} funded by everyday creators
      </span>
      <span className="pl-0 sm:pl-4">
        {counter.drops} drops launched
      </span>
    </div>
  );

  // Steps
  const steps = [
    {
      label: "Share Your Idea",
      desc: "Describe what you want to create—no technical skills or jargon.",
      emoji: "💡",
    },
    {
      label: "Invite Anyone to Join",
      desc: "Friends or strangers can support you, even with tiny amounts.",
      emoji: "🤝",
    },
    {
      label: "Build & Earn Together",
      desc: "Funds are split as you deliver. Everyone gets paid, no big upfronts.",
      emoji: "🌱",
    },
  ];

  // Optionally: carousel auto-scroll
  // (Removed - this logic is now handled inside CreatorCarousel, so no need for carouselRef here)

  const countUpDollarRef = useRef<HTMLSpanElement>(null);
  const countUpDropRef = useRef<HTMLSpanElement>(null);

  return (
    <div className="min-h-screen bg-background text-body-text flex flex-col items-center relative overflow-x-hidden">
      <FullWaveBackground />
      <section className="relative w-full pt-16 md:pt-20 pb-10 px-4 z-10 flex flex-col items-center pb-24">
        {/* HERO GRADIENT */}
        <div className="hero-gradient pointer-events-none" aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 80%,rgba(154,77,255,.28) 0%,transparent 70%)', zIndex: 0 }} />
        <div className="w-full max-w-5xl flex justify-end">
          <button
            onClick={() => setWalletOpen(true)}
            className="rounded-lg p-2 bg-gold/15 hover:bg-accent/30 text-accent transition-all"
            aria-label="Open Wallet"
          >
            <Wallet size={20} color="#FFD700" />
          </button>
        </div>
        {/* HEADLINE */}
        <h1 className="text-center font-headline font-bold text-[2.3rem] md:text-[2.7rem] lg:text-[3rem] leading-[1.13] hero-title py-2 mt-2 max-w-3xl relative z-10">
          Launch Creative Projects <span className="text-accent">With Almost No Money</span>
        </h1>
        {/* SUBHEADLINE */}
        <div className="text-lg text-[#e4f9ea] mt-4 max-w-xl mx-auto font-medium text-center mb-1">
          Invite your team, share your idea, and let anyone back your project.<br />
          You don’t need a big budget—or any wallet know-how—to get started.
        </div>
        {/* LIVE METRICS */}
        {liveMetrics}

        {/* CTA */}
        <AccentButton
          className="hero-cta mt-7 px-8 py-4 text-lg rounded-xl shadow-lg hover:scale-105 transition-all font-bold z-20"
          style={{ background: 'linear-gradient(90deg,#5D5FEF 0%,#9A4DFF 100%)', boxShadow: '0 0 16px rgba(93,95,239,.6)' }}
          onClick={wizard.openWizard}
          aria-label="Launch a Project"
        >
          Start My Project Free
        </AccentButton>

        {/* HOW IT WORKS */}
        <div className="w-full flex flex-col items-center gap-3 mt-12 mb-2">
          <h2 className="text-xl md:text-2xl font-bold text-accent mb-3">How it works</h2>
          <div className="flex flex-col md:flex-row gap-5 md:gap-7 justify-center">
            {[{
              label: "Share Your Idea",
              desc: "Describe what you want to create—no technical skills or jargon.",
              emoji: "💡",
            }, {
              label: "Invite Anyone to Join",
              desc: "Friends or strangers can support you, even with tiny amounts.",
              emoji: "🤝",
            }, {
              label: "Build & Earn Together",
              desc: "Funds are split as you deliver. Everyone gets paid, no big upfronts.",
              emoji: "🌱",
            }].map(({label, desc, emoji}) => (
              <div key={label} className="bg-card border border-accent/20 rounded-xl px-5 py-6 md:py-7 flex flex-col items-center max-w-xs shadow-md">
                <div className="text-3xl mb-2">{emoji}</div>
                <div className="font-headline text-accent font-bold mb-1">{label}</div>
                <div className="text-tagline text-sm text-center">{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* LOGO ROW */}
        <div className="w-full flex items-center justify-center mt-6 mb-2">
          <LogoRow />
        </div>

        {/* CREATOR CAROUSEL */}
        <div className="w-full max-w-5xl mx-auto">
          <CreatorCarousel carousel={carousel} />
        </div>
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

      {/* FOOTER */}
      <footer className="py-8 border-t border-border bg-[#101910] w-full text-center mt-auto z-[5]">
        <div className="flex flex-col md:flex-row justify-center items-center gap-3 mb-2 text-sm text-tagline font-mono">
          <span>
            100% non-custodial, no-code, free to start. 
          </span>
          <a href="https://discord.com/invite/lovable" target="_blank" rel="noopener noreferrer" className="mx-2 hover:text-accent underline">Join Discord</a>
          <a href="https://x.com/lovableai" target="_blank" rel="noopener noreferrer" className="mx-2 hover:text-accent underline">X (Twitter)</a>
          <a href="https://docs.lovable.dev" target="_blank" rel="noopener noreferrer" className="mx-2 hover:text-accent underline">Docs</a>
        </div>
        <div className="text-xs text-body-text/70">Made with ❤️ — Powered by Lovable + Zora, {new Date().getFullYear()}</div>
      </footer>
    </div>
  );
};

export default Index;
