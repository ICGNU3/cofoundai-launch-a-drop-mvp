
import React from "react";
import { AccentButton } from "@/components/ui/AccentButton";

type HeroSectionProps = {
  counter: { total: number; drops: number };
  onCtaClick: () => void;
  countUpDollarRef: React.RefObject<HTMLSpanElement>;
  countUpDropRef: React.RefObject<HTMLSpanElement>;
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
}) => (
  <div>
    {/* HEADLINE */}
    <h1 className="text-center font-headline font-bold text-[2.3rem] md:text-[2.7rem] lg:text-[3rem] leading-[1.13] hero-title py-2 mt-2 max-w-3xl relative z-10 font-playfair tracking-tight drop-shadow">
      TALENT = MONEY
    </h1>
    {/* SUBHEADLINE */}
    <div className="text-lg text-[#e4f9ea] mt-4 max-w-xl mx-auto font-medium text-center mb-1">
      Invite your team, share your idea, and let anyone back your project.<br />
      You don’t need a big budget or any wallet know-how to get started.
    </div>
    {/* LIVE METRICS */}
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-3 text-success font-mono text-lg font-bold mb-1 select-none">
      <span className="sm:border-r sm:border-[#45e36e88] pr-4">
        <span ref={countUpDollarRef}>${counter.total.toLocaleString()}</span> funded by everyday creators
      </span>
      <span className="pl-0 sm:pl-4">
        <span ref={countUpDropRef}>{counter.drops}</span> drops launched
      </span>
    </div>
    {/* CTA */}
    <AccentButton
      className="hero-cta mt-7 px-8 py-4 text-lg rounded-xl shadow-lg hover:scale-105 transition-all font-bold z-20"
      style={{ background: 'linear-gradient(90deg,#5D5FEF 0%,#9A4DFF 100%)', boxShadow: '0 0 16px rgba(93,95,239,.6)' }}
      onClick={onCtaClick}
      aria-label="Launch a Project"
    >
      Start My Project Free
    </AccentButton>
    {/* HOW IT WORKS */}
    <div className="w-full flex flex-col items-center gap-3 mt-12 mb-2">
      <h2 className="text-xl md:text-2xl font-bold text-accent mb-3">How it works</h2>
      <div className="flex flex-col md:flex-row gap-5 md:gap-7 justify-center">
        {steps.map(({ label, desc, emoji }) => (
          <div key={label} className="bg-card border border-accent/20 rounded-xl px-5 py-6 md:py-7 flex flex-col items-center max-w-xs shadow-md">
            <div className="text-3xl mb-2">{emoji}</div>
            <div className="font-headline text-accent font-bold mb-1">{label}</div>
            <div className="text-tagline text-sm text-center">{desc}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default HeroSection;
