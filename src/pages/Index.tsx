
import React, { useState, useEffect, useRef } from "react";
import { StreamlinedWizardButton } from "@/components/StreamlinedWizardButton";
import CreatorCarousel from "@/components/CreatorCarousel";
import LogoRow from "@/components/LogoRow";
import LandingFeaturesSection from "@/components/LandingFeaturesSection";
import { HeroSection } from "@/components/landing/HeroSection";
import LandingFooter from "@/components/landing/LandingFooter";
import AdvancedTokenCustomizationModal from "@/components/landing/AdvancedTokenCustomizationModal";
import ModernNavigation from "@/components/ModernNavigation";
import SplineBackground from "@/components/SplineBackground";
import { useAuth } from "@/contexts/AuthContext";

const Index: React.FC = () => {
  const { user } = useAuth();
  const [tokenModalOpen, setTokenModalOpen] = useState(false);

  // Live counter state
  const [counter, setCounter] = useState<{ total: number; drops: number }>({ total: 0, drops: 0 });

  // Latest projects for creator carousel
  const [carousel, setCarousel] = useState<any[]>([]);

  // Streamlined wizard state
  const [streamlinedWizardOpen, setStreamlinedWizardOpen] = useState(false);

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

  // Get wallet address from user context
  const walletAddress = user?.wallet_addresses?.[0] || null;

  return (
    <div className="min-h-screen bg-background text-body-text flex flex-col items-center relative overflow-hidden">
      <SplineBackground />
      
      <div className="content-container w-full">
        <ModernNavigation />
        
        <main className="relative w-full z-10 flex flex-col items-center">
          <HeroSection
            counter={counter}
            onCtaClick={() => setStreamlinedWizardOpen(true)}
            countUpDollarRef={countUpDollarRef}
            countUpDropRef={countUpDropRef}
          />
          
          <section id="features" className="w-full max-w-7xl mx-auto px-4 mt-20">
            <LandingFeaturesSection />
          </section>
          
          <div className="w-full flex items-center justify-center mt-16 mb-8">
            <LogoRow />
          </div>
          
          <div className="w-full max-w-5xl mx-auto px-4">
            <CreatorCarousel carousel={carousel} />
          </div>
        </main>

        <AdvancedTokenCustomizationModal isOpen={tokenModalOpen} onClose={() => setTokenModalOpen(false)} />
        
        {/* Use the new streamlined wizard */}
        <StreamlinedWizardButton 
          walletAddress={walletAddress}
          className="hidden" // Hide the button since we're controlling it manually
          isOpen={streamlinedWizardOpen}
          onOpenChange={setStreamlinedWizardOpen}
        />
        
        <LandingFooter />
      </div>
    </div>
  );
};

export default Index;
