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
import { RefinementCategorySelector } from "./ai/RefinementCategorySelector";
import { RefinementPanel } from "./ai/RefinementPanel";
import { RefinementHistoryList } from "./ai/RefinementHistoryList";
import { useContentRefinement } from "./ai/useContentRefinement";

interface ContentRefinementToolsProps {
  content: any;
  onContentRefined: (refined: any) => void;
}

export const ContentRefinementTools: React.FC<ContentRefinementToolsProps> = ({
  content,
  onContentRefined,
}) => {
  const { toast } = useToast();
  
  const { fetchAIContent } = useContentRefinement();
  
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
      <RefinementCategorySelector
        categories={refinementCategories}
        activeRefiner={activeRefiner}
        setActiveRefiner={setActiveRefiner}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {refinementCategories.find(c => c.id === activeRefiner)?.label} Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RefinementPanel
              activeRefiner={activeRefiner}
              isRefining={isRefining}
              aiSuggestions={aiSuggestions}
              platformOptimizations={platformOptimizations}
              toneAdjustments={toneAdjustments}
              applyRefinement={applyRefinement}
              customRefinement={customRefinement}
              setCustomRefinement={setCustomRefinement}
              applyCustomRefinement={applyCustomRefinement}
            />
          </CardContent>
        </Card>
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
            <RefinementHistoryList refinementHistory={refinementHistory} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
