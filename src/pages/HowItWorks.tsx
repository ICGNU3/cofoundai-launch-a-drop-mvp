
import React from "react";
import ModernNavigation from "@/components/ModernNavigation";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import LandingFooter from "@/components/landing/LandingFooter";
import SplineBackground from "@/components/SplineBackground";

const HowItWorks: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-body-text flex flex-col items-center relative overflow-hidden">
      <SplineBackground />
      
      <div className="content-container w-full">
        <ModernNavigation />
        
        <main className="relative w-full z-10 flex flex-col items-center pt-8">
          <HowItWorksSection />
        </main>

        <LandingFooter />
      </div>
    </div>
  );
};

export default HowItWorks;
