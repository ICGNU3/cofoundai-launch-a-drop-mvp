
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
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-accent via-accent/80 to-accent/60 bg-clip-text text-transparent leading-tight">
            Launch Your Creative Vision
          </h1>
          <p className="text-xl md:text-2xl text-body-text/80 max-w-3xl mx-auto leading-relaxed">
            Transform your ideas into funded projects with community support and transparent revenue sharing
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-accent">
              <span ref={countUpDollarRef}>$0</span>
            </div>
            <div className="text-sm text-body-text/60">Total Raised</div>
          </div>
          <div className="hidden sm:block w-px h-12 bg-border"></div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-accent">
              <span ref={countUpDropRef}>0</span>
            </div>
            <div className="text-sm text-body-text/60">Successful Drops</div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card/30 border border-border/50">
            <Zap className="w-8 h-8 text-accent mb-3" />
            <h3 className="font-semibold mb-2">Quick Launch</h3>
            <p className="text-sm text-body-text/70">Set up your project in minutes with guided templates</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card/30 border border-border/50">
            <Users className="w-8 h-8 text-accent mb-3" />
            <h3 className="font-semibold mb-2">Team Collaboration</h3>
            <p className="text-sm text-body-text/70">Invite collaborators and manage revenue splits transparently</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card/30 border border-border/50">
            <TrendingUp className="w-8 h-8 text-accent mb-3" />
            <h3 className="font-semibold mb-2">Community Growth</h3>
            <p className="text-sm text-body-text/70">Build an engaged community around your creative work</p>
          </div>
        </div>

        {/* Minimal CTA */}
        <div className="mt-8">
          <Button
            onClick={onCtaClick}
            size="lg"
            className="bg-accent text-black hover:bg-accent/90 font-medium px-8 py-3"
          >
            Get Started
          </Button>
          <p className="text-xs text-body-text/50 mt-2">
            Join thousands of creators building their projects
          </p>
        </div>
      </div>
    </section>
  );
};
