
import React from "react";
import { Rocket, Users, DollarSign } from "lucide-react";

const features = [
  {
    icon: <Rocket className="text-accent w-8 h-8 mb-2" />,
    title: "Instant Creation",
    desc: "Describe your drop and launch in under 2 minutes—no bureaucracy, no code.",
  },
  {
    icon: <Users className="text-accent w-8 h-8 mb-2" />,
    title: "Collaborative Roles",
    desc: "Assign clear roles and budget so every contributor is rewarded transparently.",
  },
  {
    icon: <DollarSign className="text-accent w-8 h-8 mb-2" />,
    title: "Fund & Mint in One Tap",
    desc: "Collect funds, mint, and distribute—all from a single powerful tool.",
  },
];

const LandingFeaturesSection: React.FC = () => (
  <section className="w-full max-w-4xl mx-auto py-12 px-2 grid gap-8">
    <h2 className="text-2xl font-headline font-bold text-center text-headline mb-8">
      How it Works
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {features.map(({ icon, title, desc }) => (
        <div
          key={title}
          className="bg-card rounded-xl border border-border px-5 py-8 flex flex-col items-center text-center shadow-sm hover:shadow-lg hover-scale transition"
        >
          {icon}
          <h3 className="font-bold text-lg text-headline mb-1">{title}</h3>
          <p className="text-body-text text-sm font-sans">{desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default LandingFeaturesSection;
