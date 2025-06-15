import React, { useState, useEffect, useRef } from "react";
import { WizardModal } from "@/components/WizardModal";
import { useWizardState } from "@/hooks/useWizardState";
import { AccentButton } from "@/components/ui/AccentButton";
import FullWaveBackground from "@/components/FullWaveBackground";
import { Web3WalletModule } from "@/components/Web3WalletModule";
import { Wallet } from "lucide-react";
import LandingFeaturesSection from "@/components/LandingFeaturesSection";
import AdvancedTokenCustomization from "@/components/AdvancedTokenCustomization/AdvancedTokenCustomization";

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
  const carouselRef = useRef<HTMLDivElement>(null);

  // CountUp.js ref (for bar)
  const countUpDollarRef = useRef<HTMLSpanElement>(null);
  const countUpDropRef = useRef<HTMLSpanElement>(null);

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
  useEffect(() => {
    // CSS scroll
    const el = carouselRef.current;
    if (el && carousel.length > 1) {
      let frame: number | undefined;
      let dir = 1;
      function scrollStep() {
        let max = el.scrollWidth - el.clientWidth;
        if (el.scrollLeft >= max) dir = -1;
        if (el.scrollLeft <= 0) dir = 1;
        el.scrollLeft += 0.3 * dir;
        frame = requestAnimationFrame(scrollStep);
      }
      frame = requestAnimationFrame(scrollStep);
      return () => frame && cancelAnimationFrame(frame);
    }
  }, [carousel.length]);

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
          TALENT &gt; MONEY
        </h1>
        {/* Sub-headline with social proof */}
        <div className="text-lg text-[#E0E0E0] mt-4 max-w-xl mx-auto font-medium">
          Build and fund creative projects with your team—experience instant streaming of funds as soon as you deliver.
        </div>
        {/* --- LIVE COUNTER BAR --- */}
        <div className="flex items-center justify-center w-full mt-5 mb-2 z-10" aria-live="polite">
          <div className="bg-[#242349] px-4 py-1 rounded-sm text-sm font-mono flex gap-2 shadow-lg border border-accent items-center min-w-[300px] justify-center" style={{ letterSpacing: '0.03em' }}>
            <span ref={countUpDollarRef} id="counterDollar" className="tabular-nums font-bold text-gold text-base"></span>
            <span className="text-[#b89cff] mx-1">streamed •</span>
            <span ref={countUpDropRef} id="counterDrop" className="tabular-nums font-bold text-indigo-300 text-base"></span>
            <span className="text-[#b89cff]">drops funded</span>
          </div>
        </div>
        {/* MICRO SLIDER DEMO */}
        <div className="demo flex items-center gap-4 justify-center mt-6" aria-label="Demo splitting value between artist and producer">
          <label className="text-sm text-gold">Artist</label>
          <input
            type="range"
            id="demoSlider"
            min={0}
            max={100}
            defaultValue={50}
            className="w-48 accent-[#5D5FEF] focus:ring-2 focus:ring-gold"
            onInput={handleSliderChange}
            aria-valuenow={50}
            aria-valuemin={0}
            aria-valuemax={100}
          />
          <label className="text-sm text-indigo-400">Producer</label>
        </div>
        {/* HERO CTA BUTTON */}
        <AccentButton
          className="hero-cta mt-6 sm:mt-7 px-8 py-4 text-lg rounded-xl shadow-lg hover:scale-105 transition-all font-bold z-20"
          style={{ background: 'linear-gradient(90deg,#5D5FEF 0%,#9A4DFF 100%)', boxShadow: '0 0 16px rgba(93,95,239,.6)' }}
          onClick={wizard.openWizard}
          aria-label="Launch a Drop"
        >
          <span className="inline-flex items-center gap-2">
            <span className="text-gold">🌟</span> Launch a Drop <span className="text-gold">→</span>
          </span>
        </AccentButton>
        {/* NEW: Advanced Token Customization */}
        <AccentButton
          className="mt-2 px-8 py-3 text-base rounded-xl shadow-md bg-indigo-900/80 border-2 border-accent hover:bg-accent/90 transition"
          onClick={() => setTokenModalOpen(true)}
        >
          <span className="inline-flex items-center gap-2">
            <span className="text-gold">🪙</span> Advanced Token Customization
          </span>
        </AccentButton>
        {/* CREATOR CAROUSEL */}
        <div className="carousel flex gap-6 overflow-x-auto py-8 hide-scrollbar w-full max-w-5xl" ref={carouselRef} role="list">
          {carousel.length === 0 && (
            <div className="opacity-70 text-sm italic text-neutral-400 p-8">
              Recent creator drops will appear here soon!
            </div>
          )}
          {carousel.map((proj, i) => (
            <div
              className="card w-56 flex-shrink-0 bg-[#1E1E1E] rounded shadow-inner border border-accent/20 focus-visible:ring-2 focus-visible:ring-gold"
              key={proj.id || i}
              role="listitem"
              tabIndex={0}
              aria-label={`Drop: ${proj.project_idea?.slice(0, 40)}`}
            >
              <img
                src={proj.cover_art_url || "/placeholder.svg"}
                alt={proj.project_idea?.slice(0, 40) || "Cover Art"}
                className="rounded-t w-full h-36 object-cover"
              />
              <div className="p-4 text-sm">
                “{proj.project_idea?.slice(0, 45) || "Exciting project..." }”
                <br />
                <span className="text-[#9A4DFF] font-mono">
                  @{(proj.wallet_address && proj.wallet_address.slice(0, 8) + '…') || "creator"}
                </span>
              </div>
            </div>
          ))}
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
    </div>
  );
};

export default Index;
