
import React, { useState, useEffect, useRef } from "react";
import { WizardModal } from "@/components/WizardModal";
import { useWizardState } from "@/hooks/useWizardState";
import FullWaveBackground from "@/components/FullWaveBackground";
import CreatorCarousel from "@/components/CreatorCarousel";
import LiveCounterBar from "@/components/LiveCounterBar";
import LogoRow from "@/components/LogoRow";
import LandingFeaturesSection from "@/components/LandingFeaturesSection";
import HeroSection from "@/components/landing/HeroSection";
import LandingFooter from "@/components/landing/LandingFooter";
import AdvancedTokenCustomizationModal from "@/components/landing/AdvancedTokenCustomizationModal";
import SignInButton from "@/components/ui/SignInButton";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { AIProjectKickoffModal } from "../components/AIProjectKickoffModal";

const Index: React.FC = () => {
  const wizard = useWizardState();
  const [tokenModalOpen, setTokenModalOpen] = useState(false);

  // Live counter state
  const [counter, setCounter] = useState<{ total: number; drops: number }>({ total: 0, drops: 0 });

  // Latest projects for creator carousel
  const [carousel, setCarousel] = useState<any[]>([]);

  // === AI Kickoff Integration ===
  // Hold AI modal desired wizard prefill info
  const [wizardPrefill, setWizardPrefill] = useState<any>(null);

  // State for showing the AI Launch Modal from the new section
  const [showAIModal, setShowAIModal] = useState(false);

  // Pass to HeroSection for AI modal (now unused, remains for compat)
  const handleAIKickoffFinish = (aiData: {
    projectIdea: string;
    projectType: string;
    roleSplits?: Array<{role: string; percent: number}>;
  }) => {
    setWizardPrefill(aiData);
    wizard.openWizard();
  };

  // When wizard is opened with prefill, populate initial fields
  useEffect(() => {
    if (wizardPrefill && wizard.state.isWizardOpen) {
      // Prefill wizard state (projectIdea, projectType, roles)
      if (wizardPrefill.projectIdea) wizard.setField("projectIdea", wizardPrefill.projectIdea);
      if (wizardPrefill.projectType) wizard.setField("projectType", wizardPrefill.projectType);
      if (wizardPrefill.roleSplits && wizardPrefill.roleSplits.length > 0) {
        // Convert AI roles to wizard role format
        const rolesArr = wizardPrefill.roleSplits.map(r => ({
          name: r.role,
          percent: r.percent,
          address: "", // left blank for user to fill
        }));
        wizard.setField("roles", rolesArr);
      }
      setWizardPrefill(null); // Prevent repeat
    }
  }, [wizardPrefill, wizard]);

  // Fetch stats (Edge function) and projects (from supabase)
  useEffect(() => {
    fetch("/functions/v1/stats")
      .then(r => r.json())
      .then(json => setCounter(json))
      .catch(() => setCounter({ total: 234500, drops: 98 })); // fallback placeholder
    fetch("/rest/v1/projects?status=eq.complete&order=minted_at.desc&limit=3", {
      headers: { "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY as string }
    })
      .then(r => r.json())
      .then(setCarousel)
      .catch(() => setCarousel([]));
  }, []);

  // Animate counters when value changes (CountUp.js required)
  const countUpDollarRef = useRef<HTMLSpanElement>(null);
  const countUpDropRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!window.CountUp) {
      const c = document.createElement("script");
      c.src = "https://cdn.jsdelivr.net/npm/countUp.js@2.6.2/dist/countUp.min.js";
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

  // Confetti for slider (keep for embedded demo use)
  useEffect(() => {
    if (!window.confetti) {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/canvas-confetti";
      document.body.appendChild(s);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-body-text flex flex-col items-center relative overflow-x-hidden overflow-y-auto">
      <SignInButton />
      <FullWaveBackground />
      <section className="relative w-full max-w-7xl mx-auto pt-16 md:pt-20 pb-10 px-4 z-10 flex flex-col items-center pb-24">
        <div className="hero-gradient pointer-events-none" aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 80%,rgba(154,77,255,.18) 0%,transparent 72%)', zIndex: 0 }} />
        <div className="w-full max-w-4xl mx-auto">
          <HeroSection
            counter={counter}
            onCtaClick={wizard.openWizard}
            countUpDollarRef={countUpDollarRef}
            countUpDropRef={countUpDropRef}
            onAIFinish={handleAIKickoffFinish} // (now unused)
          />
        </div>
        <div className="w-full flex items-center justify-center mt-6 mb-2">
          <LogoRow />
        </div>
        <div className="w-full max-w-5xl mx-auto">
          <CreatorCarousel carousel={carousel} />
        </div>
      </section>

      <div className="w-full max-w-7xl mx-auto px-4">
        <LandingFeaturesSection />
      </div>

      {/* === NEW: AI Launch Tools Section === */}
      <section className="w-full max-w-5xl mx-auto my-12 py-10 px-4 bg-card border border-accent/30 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-accent to-yellow bg-clip-text text-transparent mb-3">
          AI Launch Tools
        </h2>
        <p className="text-body-text/80 mb-5 max-w-2xl mx-auto">
          Use our AI tools to kickstart your next creative or collaborative project. Instantly generate a project plan, see typical role splits, and get setup in seconds.
        </p>
        <Button
          onClick={() => setShowAIModal(true)}
          variant="default"
          size="lg"
          className="rounded-xl font-bold px-8 py-4 bg-gradient-to-l from-accent to-yellow text-white shadow-md hover:from-yellow hover:to-accent transition-all"
        >
          <Sparkles className="mr-2 animate-bounce" size={20} />
          Try AI Project Planner
        </Button>
      </section>
      
      {/* AI Project Kickoff Modal shown from the AI Launch Tools button */}
      <AIProjectKickoffModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onContinueToWizard={handleAIKickoffFinish}
      />

      <AdvancedTokenCustomizationModal isOpen={tokenModalOpen} onClose={() => setTokenModalOpen(false)} />
      <WizardModal
        isOpen={wizard.state.isWizardOpen}
        onClose={wizard.closeWizard}
        walletAddress={null}
      />
      <LandingFooter />
    </div>
  );
};

export default Index;

