
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModernNavigation } from "@/components/ModernNavigation";
import FullWaveBackground from "@/components/FullWaveBackground";
import { HeroSection } from "@/components/HeroSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import LandingFeaturesSection from "@/components/LandingFeaturesSection";
import { LandingFooter } from "@/components/LandingFooter";
import { StreamlinedWizardButton } from "@/components/StreamlinedWizardButton";
import { usePrivy } from '@privy-io/react-auth';

export default function Index() {
  const { user } = usePrivy();
  const walletAddress = user?.wallet?.address || null;

  return (
    <div className="min-h-screen bg-background">
      <ModernNavigation />
      
      <div className="relative">
        <FullWaveBackground />
        
        <div className="relative z-10">
          <HeroSection />
          
          <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Launch Your Creative Project?</h2>
              <p className="text-lg text-text/70 mb-8">
                Join creators who are building their own economies with NEPLUS
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <StreamlinedWizardButton 
                  walletAddress={walletAddress}
                  size="lg"
                  className="bg-accent text-black hover:bg-accent/90 px-8 py-4 text-lg"
                >
                  Launch Your Drop
                </StreamlinedWizardButton>
                
                <Link to="/how-it-works">
                  <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                    Learn How It Works
                  </Button>
                </Link>
              </div>
              
              {import.meta.env.VITE_ENABLE_DEV_TOOLS === 'true' && (
                <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 mb-2">
                    <strong>Development Mode Active</strong>
                  </p>
                  <Link to="/dev">
                    <Button variant="outline" size="sm">
                      Open Dev Tools
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          <HowItWorksSection />
          <LandingFeaturesSection />
        </div>
      </div>
      
      <LandingFooter />
    </div>
  );
}
