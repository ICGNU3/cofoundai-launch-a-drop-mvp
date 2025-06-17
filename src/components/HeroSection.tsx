
import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { StreamlinedWizardButton } from "@/components/StreamlinedWizardButton";
import { usePrivy } from "@privy-io/react-auth";

export const HeroSection: React.FC = () => {
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address || null;
  
  // Mock counter data - in a real app this would come from your API
  const counter = { total: 150000, drops: 42 };
  
  const countUpDollarRef = useRef<HTMLSpanElement>(null);
  const countUpDropRef = useRef<HTMLSpanElement>(null);

  const handleCtaClick = () => {
    // This would trigger the wizard modal
    console.log('CTA clicked');
  };

  return (
    <div className="container mx-auto px-6 pt-16 md:pt-24 font-inter">
      <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
        {/* Main Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tighter mb-6 leading-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">CREATE</span> Your OWN Economy
        </h1>
        
        {/* Subheadline */}
        <p className="text-gray-300 text-xl md:text-2xl mb-8 max-w-3xl font-light tracking-wide">
          Build, fund, and grow your own economic ecosystem. From creative projects to business ventures - 
          turn your ideas into thriving on-chain economies with your community.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <StreamlinedWizardButton 
            walletAddress={walletAddress}
            className="bg-white text-black font-light rounded-md px-8 py-3 hover:bg-opacity-90 transition-all"
          >
            Start building
          </StreamlinedWizardButton>
          <Link to="/how-it-works" className="flex items-center justify-center text-gray-300 hover:text-white transition-colors py-3 px-2 group font-light tracking-wide">
            See how it works
            <span className="material-symbols-outlined ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto">
          <div>
            <p className="text-4xl font-light mb-1 tracking-tight">
              <span ref={countUpDollarRef}>${counter.total.toLocaleString()}</span>
            </p>
            <p className="text-gray-400 font-extralight tracking-wide">Economies created</p>
          </div>
          <div>
            <p className="text-4xl font-light mb-1 tracking-tight">
              <span ref={countUpDropRef}>{counter.drops}</span>+
            </p>
            <p className="text-gray-400 font-extralight tracking-wide">Active projects</p>
          </div>
          <div>
            <p className="text-4xl font-light mb-1 tracking-tight">24/7</p>
            <p className="text-gray-400 font-extralight tracking-wide">Community driven</p>
          </div>
          <div>
            <p className="text-4xl font-light mb-1 tracking-tight">100%</p>
            <p className="text-gray-400 font-extralight tracking-wide">Decentralized</p>
          </div>
        </div>
      </div>
    </div>
  );
};
