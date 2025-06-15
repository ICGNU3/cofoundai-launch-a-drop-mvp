
import React from "react";
import { Rocket, Users, DollarSign } from "lucide-react";

const features = [
  {
    icon: (
      <div className="bg-gradient-to-br from-accent-start to-yellow rounded-full p-3 mb-3 shadow-lg flex items-center justify-center">
        <Rocket className="text-white w-7 h-7 drop-shadow-lg" />
      </div>
    ),
    title: "Instant Creation",
    desc: "Describe your drop and launch in under 2 minutes. No bureaucracy, no code.",
  },
  {
    icon: (
      <div className="bg-gradient-to-br from-accent to-gold rounded-full p-3 mb-3 shadow-lg flex items-center justify-center">
        <Users className="text-white w-7 h-7 drop-shadow-lg" />
      </div>
    ),
    title: "Collaborative Roles",
    desc: "Assign clear roles and budget so every contributor is rewarded transparently.",
  },
  {
    icon: (
      <div className="bg-gradient-to-br from-accent to-gold rounded-full p-3 mb-3 shadow-lg flex items-center justify-center">
        <DollarSign className="text-white w-7 h-7 drop-shadow-lg" />
      </div>
    ),
    title: "Fund & Mint in One Tap",
    desc: "Collect funds, mint, and distribute - all from a single powerful tool.",
  },
];

const LandingFeaturesSection: React.FC = () => (
  <section className="w-full max-w-4xl mx-auto py-12 px-2 grid gap-8">
    <h2 className="text-2xl font-headline font-bold text-center text-success mb-8 drop-shadow">
      How it Works
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {features.map(({ icon, title, desc }) => (
        <div
          key={title}
          className="bg-card rounded-xl border-2 border-accent/30 px-5 py-8 flex flex-col items-center text-center shadow-card-elevated hover:scale-105 hover:border-gold transition"
        >
          {icon}
          <h3 className="font-bold text-lg text-accent mb-1">{title}</h3>
          <p className="text-body-text text-sm font-sans">{desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default LandingFeaturesSection;

