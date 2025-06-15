
import React from "react";
import { Button } from "@/components/ui/button";
import { AIContentGenerationHub } from "../AIContentGenerationHub";

interface Wizard4AIContentSectionProps {
  projectIdea: string;
  projectType: string;
  onContentGenerated: (content: any) => void;
  setActiveTab: (value: string) => void;
}

export const Wizard4AIContentSection: React.FC<Wizard4AIContentSectionProps> = ({
  projectIdea,
  projectType,
  onContentGenerated,
  setActiveTab,
}) => (
  <div className="space-y-6">
    <div className="text-center space-y-2 mb-6">
      <h3 className="text-xl font-bold">AI-Powered Content Generation</h3>
      <p className="text-body-text/70">
        Create professional marketing assets before launching your drop
      </p>
    </div>

    <AIContentGenerationHub
      projectIdea={projectIdea}
      projectType={projectType}
      onContentGenerated={onContentGenerated}
    />

    <div className="flex justify-center mt-8">
      <Button
        onClick={() => setActiveTab("summary")}
        variant="outline"
      >
        ← Back to Summary
      </Button>
    </div>
  </div>
);
