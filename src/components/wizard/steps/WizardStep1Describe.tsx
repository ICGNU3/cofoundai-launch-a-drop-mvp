
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ProjectTypeSelector } from "@/components/ui/ProjectTypeSelector";
import { ModeSelector } from "@/components/ui/ModeSelector";
import { Lightbulb, ArrowRight } from "lucide-react";
import type { StreamlinedWizardState } from "@/hooks/wizard/useStreamlinedWizard";

interface WizardStep1DescribeProps {
  state: StreamlinedWizardState;
  updateField: <K extends keyof StreamlinedWizardState>(field: K, value: StreamlinedWizardState[K]) => void;
  nextStep: () => void;
  onShowInspiration: () => void;
  walletAddress: string | null;
}

export const WizardStep1Describe: React.FC<WizardStep1DescribeProps> = ({
  state,
  updateField,
  nextStep,
  onShowInspiration,
  walletAddress,
}) => {
  const canProceed = state.projectIdea.trim().length >= 10;

  const handleModeChange = (mode: any) => {
    updateField("mode", mode);
    if (mode === "solo" && walletAddress) {
      updateField("roles", [{
        name: "Creator",
        percent: 100,
        percentNum: 100,
        percentStr: "100",
        address: walletAddress,
        isFixed: false,
      }]);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Inspiration CTA */}
      <Card className="bg-accent/5 border-accent/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-5 h-5 text-accent flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-text">
                <strong>New to project launches?</strong> Browse our template gallery for inspiration and quick setup.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={onShowInspiration}>
              Browse Templates
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Project Mode */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Project Mode</CardTitle>
        </CardHeader>
        <CardContent>
          <ModeSelector 
            mode={state.mode}
            onModeChange={handleModeChange}
          />
        </CardContent>
      </Card>

      {/* Project Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Describe Your Project</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">
              What's your creative vision? <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={state.projectIdea}
              onChange={(e) => updateField("projectIdea", e.target.value)}
              placeholder="Tell us about your project - what you're creating, your goals, and what makes it special..."
              rows={4}
              className="mt-2"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-text/60">
                Minimum 10 characters required
              </p>
              <span className={`text-xs ${
                state.projectIdea.length >= 10 ? "text-accent" : "text-text/50"
              }`}>
                {state.projectIdea.length}/2000
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Project Category</label>
            <div className="mt-2">
              <ProjectTypeSelector 
                projectType={state.projectType}
                onProjectTypeChange={(type) => updateField("projectType", type)}
                onLoadDefaultRoles={() => {}} // Not used in streamlined flow
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-end pt-4">
        <Button
          onClick={nextStep}
          disabled={!canProceed}
          className="bg-accent text-black hover:bg-accent/90 gap-2"
        >
          Continue to Team & Budget
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Help Text */}
      <div className="text-center text-xs text-text/50 border-t border-border pt-4">
        <p>Don't worry, you can always edit these details later</p>
      </div>
    </div>
  );
};
