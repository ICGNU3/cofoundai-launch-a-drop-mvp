import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AccentButton } from "@/components/ui/AccentButton";
import { Wand2, RefreshCw, TrendingUp, Eye, Target, Zap, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContentRefinementToolsProps {
  content: any;
  onContentRefined: (refined: any) => void;
}

export const ContentRefinementTools: React.FC<ContentRefinementToolsProps> = ({
  content,
  onContentRefined,
}) => {
  const { toast } = useToast();
  
  const [activeRefiner, setActiveRefiner] = useState("suggestions");
  const [customRefinement, setCustomRefinement] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [refinementHistory, setRefinementHistory] = useState<any[]>([]);

  const refinementCategories = [
    {
      id: "suggestions",
      label: "AI Suggestions",
      icon: Zap,
      description: "Get contextual improvement suggestions",
    },
    {
      id: "optimization",
      label: "Platform Optimization",
      icon: TrendingUp,
      description: "Optimize for specific platform performance",
    },
    {
      id: "tone",
      label: "Tone Adjustment",
      icon: Settings,
      description: "Modify tone and style",
    },
    {
      id: "custom",
      label: "Custom Refinement",
      icon: Wand2,
      description: "Apply specific changes",
    },
  ];

  const aiSuggestions = [
    {
      type: "engagement",
      title: "Increase Engagement",
      description: "Add emojis and call-to-action phrases",
      action: "Apply",
    },
    {
      type: "clarity",
      title: "Improve Clarity",
      description: "Simplify language and structure",
      action: "Apply",
    },
    {
      type: "urgency",
      title: "Add Urgency",
      description: "Include time-sensitive language",
      action: "Apply",
    },
    {
      type: "personalization",
      title: "Personalize Content",
      description: "Make it more relatable to your audience",
      action: "Apply",
    },
    {
      type: "seo",
      title: "SEO Optimization",
      description: "Improve search visibility",
      action: "Apply",
    },
  ];

  const platformOptimizations = [
    {
      platform: "Twitter/X",
      suggestions: ["Add trending hashtags", "Use thread format", "Include poll question"],
    },
    {
      platform: "Instagram",
      suggestions: ["Add story hooks", "Include hashtag strategy", "Create carousel content"],
    },
    {
      platform: "LinkedIn",
      suggestions: ["Professional tone", "Industry insights", "Thought leadership angle"],
    },
    {
      platform: "TikTok",
      suggestions: ["Hook in first 3 seconds", "Trending sounds", "Challenge format"],
    },
  ];

  const toneAdjustments = [
    { label: "More Professional", value: "professional" },
    { label: "More Casual", value: "casual" },
    { label: "More Exciting", value: "exciting" },
    { label: "More Authoritative", value: "authoritative" },
    { label: "More Friendly", value: "friendly" },
    { label: "More Urgent", value: "urgent" },
  ];

  // Add Edge Function call for AI refinement
  const fetchAIContent = async (prompt: string, model = "gpt-4o-mini") => {
    try {
      const res = await fetch("/functions/v1/generate-content-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model }),
      });
      const data = await res.json();
      if (data.generated) return data.generated;
      throw new Error(data.error || "AI generation failed");
    } catch (err: any) {
      toast({
        title: "AI Error",
        description: err?.message || "Failed to generate content.",
        variant: "destructive",
      });
      return null;
    }
  };

  // Update applyRefinement for AI-backed output
  const applyRefinement = async (type: string, value?: string) => {
    setIsRefining(true);
    try {
      let aiPrompt = "";
      switch (type) {
        case "suggestions":
          aiPrompt = `Suggest improvements for this content: "${content.copy?.[0]?.content || ""}". Focus: ${value || "general improvement."}`;
          break;
        case "platform":
          aiPrompt = `Optimize this content for ${value}. Here is the content: "${content.copy?.[0]?.content || ""}"`;
          break;
        case "tone":
          aiPrompt = `Rewrite this marketing copy to have a more ${value} tone. Content: "${content.copy?.[0]?.content || ""}"`;
          break;
        case "custom":
          aiPrompt = `Apply this custom refinement: "${value}" to the content: "${content.copy?.[0]?.content || ""}"`;
          break;
        default:
          aiPrompt = `Improve this content: "${content.copy?.[0]?.content || ""}"`;
      }
      const aiResult = await fetchAIContent(aiPrompt);

      const refinement = {
        id: Date.now(),
        type,
        value,
        timestamp: new Date().toISOString(),
        content: aiResult,
        description: `Applied ${type} refinement`,
      };

      setRefinementHistory(prev => [refinement, ...prev]);
      onContentRefined(refinement);

      toast({
        title: "Content Refined! ✨",
        description: `${type} refinement has been applied successfully via AI.`,
      });
    } catch (error) {
      toast({
        title: "Refinement Failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefining(false);
    }
  };

  const applyCustomRefinement = async () => {
    if (!customRefinement.trim()) return;
    await applyRefinement("custom", customRefinement);
    setCustomRefinement("");
  };

  return (
    <div className="space-y-6">
      {/* Refinement Categories */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {refinementCategories.map((category) => (
          <Card
            key={category.id}
            className={`cursor-pointer transition ${
              activeRefiner === category.id
                ? "border-accent bg-accent/5"
                : "hover:border-accent/50"
            }`}
            onClick={() => setActiveRefiner(category.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <category.icon size={16} />
                <CardTitle className="text-sm">{category.label}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-xs">
                {category.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Refinement Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {refinementCategories.find(c => c.id === activeRefiner)?.label} Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeRefiner === "suggestions" && (
              <div className="space-y-3">
                {aiSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.type}
                    className="flex items-center justify-between p-3 border border-border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-sm">{suggestion.title}</h4>
                      <p className="text-xs text-body-text/70">{suggestion.description}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => applyRefinement(suggestion.type)}
                      disabled={isRefining}
                    >
                      {suggestion.action}
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {activeRefiner === "optimization" && (
              <div className="space-y-4">
                {platformOptimizations.map((platform) => (
                  <div key={platform.platform} className="space-y-2">
                    <h4 className="font-medium text-sm">{platform.platform}</h4>
                    <div className="space-y-1">
                      {platform.suggestions.map((suggestion, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-xs"
                          onClick={() => applyRefinement("platform", suggestion)}
                          disabled={isRefining}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeRefiner === "tone" && (
              <div className="space-y-3">
                {toneAdjustments.map((tone) => (
                  <Button
                    key={tone.value}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => applyRefinement("tone", tone.value)}
                    disabled={isRefining}
                  >
                    {tone.label}
                  </Button>
                ))}
              </div>
            )}

            {activeRefiner === "custom" && (
              <div className="space-y-4">
                <Textarea
                  value={customRefinement}
                  onChange={(e) => setCustomRefinement(e.target.value)}
                  placeholder="Describe the specific changes you want to make..."
                  className="min-h-[100px]"
                />
                <AccentButton
                  onClick={applyCustomRefinement}
                  disabled={isRefining || !customRefinement.trim()}
                  className="w-full"
                >
                  {isRefining ? (
                    <>
                      <RefreshCw size={16} className="mr-2 animate-spin" />
                      Applying...
                    </>
                  ) : (
                    <>
                      <Wand2 size={16} className="mr-2" />
                      Apply Custom Refinement
                    </>
                  )}
                </AccentButton>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Refinement History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw size={20} />
              Refinement History
            </CardTitle>
            <CardDescription>
              Track and manage your content improvements
            </CardDescription>
          </CardHeader>
          <CardContent>
            {refinementHistory.length > 0 ? (
              <div className="space-y-3">
                {refinementHistory.slice(0, 5).map((refinement) => (
                  <div
                    key={refinement.id}
                    className="p-3 border border-border rounded-lg space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {refinement.type}
                      </Badge>
                      <span className="text-xs text-body-text/60">
                        {new Date(refinement.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm">{refinement.description}</p>
                    {refinement.value && (
                      <p className="text-xs text-body-text/70 italic">
                        "{refinement.value}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-body-text/50">
                <RefreshCw size={48} className="mx-auto mb-4 opacity-20" />
                <p>Apply refinements to see history here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
