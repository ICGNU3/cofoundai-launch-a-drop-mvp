
import React from "react";
import { AccentButton } from "@/components/ui/AccentButton";

type HeroSectionProps = {
  counter: { total: number; drops: number };
  onCtaClick: () => void;
  countUpDollarRef: React.RefObject<HTMLSpanElement>;
  countUpDropRef: React.RefObject<HTMLSpanElement>;
  // New! allows parent to handle AI wizard handoff
  onAIFinish?: (aiData: { projectIdea: string; projectType: string; roleSplits?: Array<{ role: string; percent: number }> }) => void;
};

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

const HeroSection: React.FC<HeroSectionProps> = ({
  counter,
  onCtaClick,
  countUpDollarRef,
  countUpDropRef,
  onAIFinish, // NEW PROP (now unused)
}) => {
  // Remove all AI modal logic

  return (
    <div className="w-full text-center">
      {/* HEADLINE */}
      <h1 className="text-center font-headline font-bold text-[2rem] md:text-[2.7rem] lg:text-[3rem] leading-[1.13] hero-title py-2 mt-2 max-w-3xl mx-auto relative z-10 font-playfair tracking-tight drop-shadow">
        TALENT = MONEY
      </h1>
      {/* SUBHEADLINE */}
      <div className="text-base md:text-lg text-[#e4f9ea] mt-4 max-w-xl mx-auto font-medium text-center mb-1 px-4">
        Invite your team, share your idea, and let anyone back your project.<br />
        You don't need a big budget or any wallet know-how to get started.
      </div>
      {/* CTA */}
      <div className="flex justify-center mt-7 px-4">
        <AccentButton
          className="hero-cta px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-xl shadow-lg hover:scale-105 transition-all font-bold z-20 w-full max-w-xs"
          style={{ background: 'linear-gradient(90deg,#5D5FEF 0%,#9A4DFF 100%)', boxShadow: '0 0 16px rgba(93,95,239,.6)' }}
          onClick={onCtaClick}
          aria-label="Launch Project Wizard"
        >
          Start My Project
        </AccentButton>
      </div>
      {/* HOW IT WORKS */}
      <div className="w-full flex flex-col items-center gap-3 mt-12 mb-2 px-4">
        <h2 className="text-lg md:text-2xl font-bold text-accent mb-3 text-center">How it works</h2>
        <div className="flex flex-col md:flex-row gap-4 md:gap-7 justify-center w-full max-w-4xl">
          {steps.map(({ label, desc, emoji }) => (
            <div key={label} className="bg-card border border-accent/20 rounded-xl px-4 md:px-5 py-5 md:py-7 flex flex-col items-center max-w-xs mx-auto shadow-md">
              <div className="text-2xl md:text-3xl mb-2">{emoji}</div>
              <div className="font-headline text-accent font-bold mb-1 text-center text-sm md:text-base">{label}</div>
              <div className="text-tagline text-xs md:text-sm text-center">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
