
import React from "react";
import { Button } from "@/components/ui/button";
import { Zap, TrendingUp, Users } from "lucide-react";

interface HeroSectionProps {
  counter: { total: number; drops: number };
  onCtaClick: () => void;
  countUpDollarRef: React.RefObject<HTMLSpanElement>;
  countUpDropRef: React.RefObject<HTMLSpanElement>;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  counter,
  onCtaClick,
  countUpDollarRef,
  countUpDropRef,
}) => {
  return (
    <section className="relative w-full max-w-6xl mx-auto px-4 pt-20 pb-16 text-center">
      <div className="space-y-8">
        {/* Main Headline */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-light bg-gradient-to-r from-accent via-accent/80 to-accent/60 bg-clip-text text-transparent leading-tight">
            Fund Your Creative Projects
          </h1>
          <p className="text-xl md:text-2xl text-body-text/80 max-w-3xl mx-auto leading-relaxed font-light">
            Launch creative projects with transparent team collaboration, fair revenue splits, and community backing
          </p>
        </div>

        {/* Stats - Using projected numbers */}
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-light text-accent">
              $2.4M+
            </div>
            <div className="text-sm text-body-text/60 font-light">Total Raised</div>
          </div>
          <div className="hidden sm:block w-px h-12 bg-border"></div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-light text-accent">
              150+
            </div>
            <div className="text-sm text-body-text/60 font-light">Projects Funded</div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card/30 border border-border/50">
            <Zap className="w-8 h-8 text-accent mb-3" />
            <h3 className="font-light text-lg mb-2">Quick Launch</h3>
            <p className="text-sm text-body-text/70 font-light">Set up your project in minutes with guided templates</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card/30 border border-border/50">
            <Users className="w-8 h-8 text-accent mb-3" />
            <h3 className="font-light text-lg mb-2">Team Collaboration</h3>
            <p className="text-sm text-body-text/70 font-light">Invite collaborators and manage revenue splits transparently</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card/30 border border-border/50">
            <TrendingUp className="w-8 h-8 text-accent mb-3" />
            <h3 className="font-light text-lg mb-2">Community Growth</h3>
            <p className="text-sm text-body-text/70 font-light">Build an engaged community around your creative work</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8">
          <Button
            onClick={onCtaClick}
            size="lg"
            className="bg-accent text-black hover:bg-accent/90 font-light px-8 py-3"
          >
            Start Your Project
          </Button>
          <p className="text-xs text-body-text/50 mt-2 font-light">
            Join thousands of creators building their projects
          </p>
        </div>
      </div>
    </section>
  );
};
