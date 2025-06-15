
import React from "react";
import { AccentButton } from "./ui/AccentButton";

interface WizardStep1DescribeProps {
  projectIdea: string;
  setField: (k: "projectIdea", v: string) => void;
  onNext: () => void;
}

export const WizardStep1Describe: React.FC<WizardStep1DescribeProps> = ({
  projectIdea,
  setField,
  onNext,
}) => (
  <div>
    <h2 className="hero-title text-center">Describe Your Project Idea</h2>
    <textarea
      className="w-full mt-2 mb-7 min-h-[100px] resize-none"
      value={projectIdea}
      maxLength={256}
      onChange={e => setField("projectIdea", e.target.value)}
      placeholder="Three-track lo-fi EP…"
    />
    <AccentButton className="w-full mt-2" onClick={onNext}>
      Next: Crew &amp; Cut →
    </AccentButton>
  </div>
);

