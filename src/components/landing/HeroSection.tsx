
import React from "react";
import { AccentButton } from "@/components/ui/AccentButton";

type HeroSectionProps = {
  counter: { total: number; drops: number };
  onCtaClick: () => void;
  countUpDollarRef: React.RefObject<HTMLSpanElement>;
  countUpDropRef: React.RefObject<HTMLSpanElement>;
  onAIFinish?: (aiData: { projectIdea: string; projectType: string; roleSplits?: Array<{ role: string; percent: number }> }) => void;
};

const HeroSection: React.FC<HeroSectionProps> = ({
  counter,
  onCtaClick,
  countUpDollarRef,
  countUpDropRef,
  onAIFinish,
}) => {
  return (
    <div className="container mx-auto px-6 pt-16 md:pt-24">
      <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
        {/* Main Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tighter mb-6 leading-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Launch</span> on-chain drops with NEPLUS
        </h1>
        
        {/* Subheadline */}
        <p className="text-gray-300 text-xl md:text-2xl mb-8 max-w-3xl font-light tracking-wide">
          Mint a Coin, seed liquidity, share it on Farcaster, grow your market in real time. 
          No big budget or wallet expertise required.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <button 
            className="bg-white text-black font-medium rounded-md px-8 py-3 hover:bg-opacity-90 transition-all"
            onClick={onCtaClick}
          >
            Get started
          </button>
          <a href="#how-it-works" className="flex items-center justify-center text-gray-300 hover:text-white transition-colors py-3 px-2 group">
            Learn more
            <span className="material-symbols-outlined ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </a>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto">
          <div>
            <p className="text-4xl font-light mb-1 tracking-tight">
              <span ref={countUpDollarRef}>${counter.total.toLocaleString()}</span>
            </p>
            <p className="text-gray-400 font-extralight">Total value locked</p>
          </div>
          <div>
            <p className="text-4xl font-light mb-1 tracking-tight">
              <span ref={countUpDropRef}>{counter.drops}</span>+
            </p>
            <p className="text-gray-400 font-extralight">Active drops</p>
          </div>
          <div>
            <p className="text-4xl font-light mb-1 tracking-tight">24/7</p>
            <p className="text-gray-400 font-extralight">Liquidity available</p>
          </div>
          <div>
            <p className="text-4xl font-light mb-1 tracking-tight">100%</p>
            <p className="text-gray-400 font-extralight">On-chain verified</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
