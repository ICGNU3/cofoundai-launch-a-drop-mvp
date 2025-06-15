import React, { useState } from "react";
import { X, Sparkles, Users, Loader2, BarChart3, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAICopyGeneration } from "@/components/ai/useAICopyGeneration";

const TYPICAL_SPLITS = {
  Music: [
    { role: "Artist", percent: 50 },
    { role: "Producer", percent: 20 },
    { role: "Label", percent: 20 },
    { role: "Manager", percent: 10 },
  ],
  Film: [
    { role: "Director", percent: 30 },
    { role: "Producer", percent: 30 },
    { role: "Writer", percent: 20 },
    { role: "Editor", percent: 10 },
    { role: "Other", percent: 10 },
  ],
  Fashion: [
    { role: "Designer", percent: 50 },
    { role: "Production", percent: 30 },
    { role: "Marketing", percent: 10 },
    { role: "Manager", percent: 10 },
  ],
  Art: [
    { role: "Artist", percent: 80 },
    { role: "Gallery", percent: 15 },
    { role: "Curator", percent: 5 },
  ],
  Other: [
    { role: "Creator", percent: 100 },
  ],
};

const PROJECT_TYPES = Object.keys(TYPICAL_SPLITS);

export const AIProjectKickoffModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onContinueToWizard?: (aiData: { projectIdea: string; projectType: string; roleSplits?: Array<{ role: string; percent: number }> }) => void;
}> = ({ isOpen, onClose, onContinueToWizard }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [idea, setIdea] = useState("");
  const [projectType, setProjectType] = useState("Music");
  const [aiPlan, setAiPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const { fetchAIContent } = useAICopyGeneration();

  const handleSubmitIdea = async () => {
    setLoading(true);
    setAiError(null);
    // Call AI to generate action plan for user's idea and type
    const prompt = `
A user submitted a new ${projectType} project idea: "${idea}".
1. Summarize the core idea in one sentence.
2. Give a 4-step plan for launch, each with one sentence.
3. List any "gotchas" or common mistakes very briefly.
Output:
[One-sentence summary]
[Step 1]
[Step 2]
[Step 3]
[Step 4]
[Tip 1], [Tip 2]
    `;
    const aiText = await fetchAIContent(prompt, "gpt-4o-mini");
    if (!aiText) {
      setAiPlan("Could not generate plan from AI.");
      setAiError("AI did not return any result (see toast for details).");
      setLoading(false);
      setStep(2);
      return;
    }
    setAiPlan(aiText);
    setLoading(false);
    setStep(2);
  };

  // Chart color palette
  const chartColors = [
    "bg-gradient-to-r from-accent to-gold",
    "bg-gradient-to-r from-yellow to-accent",
    "bg-gradient-to-r from-purple-400 to-fuchsia-500",
    "bg-gradient-to-r from-green-400 to-green-600",
    "bg-gradient-to-r from-orange-400 to-yellow-500"
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl animate-fade-in transition-all">
      <div className="relative w-full max-w-lg md:max-w-2xl bg-card border border-accent/30 rounded-2xl shadow-2xl mx-2 px-0 md:px-0 pb-1 overflow-hidden animate-scale-in">
        <button
          onClick={onClose}
          className="absolute right-5 top-6 p-2 z-20 hover:text-accent"
          aria-label="Close"
        >
          <X size={22} />
        </button>
        <div className="w-full p-6 pb-2 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-accent/10 to-zinc-900 animate-fade-in">
          <Sparkles className="mb-2 text-accent animate-bounce" size={32} />
          <h2 className="font-bold text-2xl md:text-3xl text-center mb-2">
            <span className="bg-gradient-to-r from-accent to-yellow bg-clip-text text-transparent">Let AI Launch Your Creative Project</span>
          </h2>
          <p className="text-body-text/80 text-center mb-3">
            We'll generate a launch plan and show you typical splits—just enter your idea!
          </p>
        </div>
        <div className="w-full p-6 pt-0">
          {step === 1 && (
            <>
              <div className="mb-4">
                <label className="block font-medium mb-1">What's your project idea?</label>
                <Input
                  placeholder="E.g. Launch a chill summer music EP with friends"
                  value={idea}
                  onChange={e => setIdea(e.target.value)}
                  className="mb-2"
                  autoFocus
                />
                <label className="block font-medium mb-1 mt-4">Project Type</label>
                <div className="flex flex-wrap gap-2">
                  {PROJECT_TYPES.map(type => (
                    <Button
                      key={type}
                      size="sm"
                      variant={type === projectType ? "default" : "outline"}
                      className="rounded-full px-3 py-1 text-xs"
                      onClick={() => setProjectType(type)}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="mt-7 flex justify-end">
                <Button
                  onClick={handleSubmitIdea}
                  disabled={!idea.trim() || loading}
                  className="w-full md:w-auto"
                >
                  {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Sparkles size={18} className="mr-2" />}
                  Generate Plan & Split
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="mb-6 space-y-4 animate-fade-in">
                <div className="flex items-center gap-2 text-accent font-semibold text-lg mb-2">
                  <ClipboardList size={20} />
                  AI Launch Plan
                </div>
                <pre className="bg-background/70 border border-accent/15 rounded-lg px-4 py-3 font-mono whitespace-pre-wrap text-sm scrollbar-thin max-h-64 animate-fade-in">{aiPlan}</pre>
                {aiError &&
                  <div className="text-red-500 text-xs mt-2">Error: {aiError}</div>
                }
              </div>
              <div className="h-4"></div>
              <div className="flex w-full justify-between mt-6">
                <Button variant="outline" onClick={() => setStep(1)}>
                  ← Back
                </Button>
                <Button onClick={() => setStep(3)} className="bg-gradient-to-l from-accent to-yellow text-white shadow-xl hover:from-yellow hover:to-accent animate-bounce">
                  Show Split Chart →
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-2 text-accent font-semibold text-lg mb-2">
                <BarChart3 size={20} />
                Industry-Standard Role Split
              </div>
              <div className="mt-2">
                {TYPICAL_SPLITS[projectType].map((r, idx) => (
                  <div key={r.role} className="mb-3 flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full shadow ${chartColors[idx % chartColors.length]}`}></div>
                    <div className="font-semibold">{r.role}</div>
                    <div className="flex-1 h-2 mx-2 rounded bg-muted-foreground/20 relative shadow-inner">
                      <div
                        className={`absolute top-0 left-0 h-2 rounded transition-all ${chartColors[idx % chartColors.length]}`}
                        style={{ width: `${r.percent}%`, minWidth: "16px" }}
                      />
                    </div>
                    <div className="font-mono text-xs text-accent w-10 text-right">{r.percent}%</div>
                  </div>
                ))}
              </div>
              <div className="text-xs text-body-text/70 mt-5 mb-3 italic">
                Typical {projectType} project splits – tweak as you like in the next step.
              </div>
              <div className="flex w-full justify-between mt-6">
                <Button variant="outline" onClick={() => setStep(2)}>
                  ← Back
                </Button>
                <Button 
                  variant="default"
                  onClick={() => {
                    if (onContinueToWizard) {
                      onContinueToWizard({
                        projectIdea: idea,
                        projectType,
                        roleSplits: TYPICAL_SPLITS[projectType],
                      });
                    }
                  }}
                  className="px-6"
                >
                  Continue to Full Wizard
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
