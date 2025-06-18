
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ProjectTypeSelector } from "@/components/ui/ProjectTypeSelector";
import { ModeSelector } from "@/components/ui/ModeSelector";
import { Lightbulb, ArrowRight, CheckCircle, AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  const projectIdeaLength = state.projectIdea.trim().length;
  const canProceed = projectIdeaLength >= 10;
  const isOptimal = projectIdeaLength >= 50 && projectIdeaLength <= 500;

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
    } else if (mode === "team") {
      updateField("roles", []);
    }
  };

  const getProjectIdeaStatus = () => {
    if (projectIdeaLength === 0) return { type: "neutral", message: "Start by describing your creative vision" };
    if (projectIdeaLength < 10) return { type: "error", message: `Add ${10 - projectIdeaLength} more characters to continue` };
    if (projectIdeaLength < 50) return { type: "warning", message: "Consider adding more details for better visibility" };
    if (projectIdeaLength > 500) return { type: "warning", message: "Consider keeping it concise for better engagement" };
    return { type: "success", message: "Perfect! Your description looks great" };
  };

  const status = getProjectIdeaStatus();

  return (
    <div className="p-6 space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center gap-2 text-sm text-accent">
        <div className="w-2 h-2 bg-accent rounded-full"></div>
        <span>Step 1 of 3: Project Basics</span>
      </div>

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
          <CardTitle className="text-base flex items-center gap-2">
            Project Mode
            <Info className="w-4 h-4 text-text/60" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ModeSelector 
            mode={state.mode}
            onModeChange={handleModeChange}
          />
          <div className="mt-3 p-3 bg-background/50 rounded-lg">
            <p className="text-xs text-text/70">
              {state.mode === "solo" 
                ? "Perfect for individual creators. You'll keep 100% of revenue by default."
                : "Great for collaborative projects. You'll set up team roles and revenue splits in the next step."
              }
            </p>
          </div>
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
            
            {/* Real-time feedback */}
            <div className="flex justify-between items-start mt-2">
              <div className="flex-1">
                {status.type !== "neutral" && (
                  <div className={`flex items-center gap-1 text-xs ${
                    status.type === "success" ? "text-green-600" :
                    status.type === "warning" ? "text-yellow-600" : "text-red-500"
                  }`}>
                    {status.type === "success" && <CheckCircle className="w-3 h-3" />}
                    {status.type === "error" && <AlertCircle className="w-3 h-3" />}
                    {status.type === "warning" && <AlertCircle className="w-3 h-3" />}
                    <span>{status.message}</span>
                  </div>
                )}
              </div>
              <span className={`text-xs ${
                projectIdeaLength >= 10 ? "text-accent" : "text-text/50"
              }`}>
                {projectIdeaLength}/2000
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Project Category</label>
            <div className="mt-2">
              <ProjectTypeSelector 
                projectType={state.projectType}
                onProjectTypeChange={(type) => updateField("projectType", type)}
                onLoadDefaultRoles={() => {}}
              />
            </div>
            <p className="text-xs text-text/60 mt-2">
              This helps others discover your project and provides relevant templates
            </p>
          </div>

          {/* Best Practices Tips */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Tips for a great description:</strong>
              <ul className="mt-1 ml-4 list-disc text-xs space-y-1">
                <li>Explain what makes your project unique</li>
                <li>Mention your goals and timeline</li>
                <li>Include what supporters can expect</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-end pt-4">
        <Button
          onClick={nextStep}
          disabled={!canProceed}
          className="bg-accent text-black hover:bg-accent/90 gap-2 min-w-[200px]"
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
