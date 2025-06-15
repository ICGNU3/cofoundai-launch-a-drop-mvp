import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AccentButton } from "@/components/ui/AccentButton";
import { FileText, RefreshCw, Copy, Edit, Sparkles, Target, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AICopyGeneratorControls } from "./ai/AICopyGeneratorControls";
import { AIGeneratedCopyList } from "./ai/AIGeneratedCopyList";
import { useAICopyGeneration } from "./ai/useAICopyGeneration";

interface AICopyGeneratorProps {
  projectIdea: string;
  projectType: string;
  onCopyGenerated: (copy: any) => void;
}

export const AICopyGenerator: React.FC<AICopyGeneratorProps> = ({
  projectIdea,
  projectType,
  onCopyGenerated,
}) => {
  const { toast } = useToast();
  
  const [targetAudience, setTargetAudience] = useState("");
  const [tone, setTone] = useState("engaging");
  const [keyMessages, setKeyMessages] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["twitter", "instagram"]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCopy, setGeneratedCopy] = useState<any[]>([]);
  const [refinementRequest, setRefinementRequest] = useState("");

  const tones = [
    { value: "professional", label: "Professional" },
    { value: "playful", label: "Playful" },
    { value: "urgent", label: "Urgent" },
    { value: "inspiring", label: "Inspiring" },
    { value: "casual", label: "Casual" },
    { value: "authoritative", label: "Authoritative" },
    { value: "friendly", label: "Friendly" },
    { value: "mysterious", label: "Mysterious" },
    { value: "exciting", label: "Exciting" },
    { value: "educational", label: "Educational" },
  ];

  const platforms = [
    { value: "twitter", label: "Twitter/X", limit: "280 chars", icon: "🐦" },
    { value: "instagram", label: "Instagram", limit: "2,200 chars", icon: "📸" },
    { value: "facebook", label: "Facebook", limit: "63,206 chars", icon: "📘" },
    { value: "linkedin", label: "LinkedIn", limit: "3,000 chars", icon: "💼" },
    { value: "blog", label: "Blog Post", limit: "No limit", icon: "📝" },
    { value: "email", label: "Email", limit: "200 words", icon: "📧" },
    { value: "press", label: "Press Release", limit: "400-600 words", icon: "📰" },
    { value: "website", label: "Website Copy", limit: "Varies", icon: "🌐" },
  ];

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const { fetchAIContent } = useAICopyGeneration();

  const generateCopy = async () => {
    setIsGenerating(true);
    try {
      const mockFn = async (platform: string) => {
        const prompt = `Write a ${tone} marketing announcement for a ${projectType} project called "${projectIdea}". Platform: ${platform}. Target audience: ${targetAudience || "general"}. Key messages: ${keyMessages || "Default campaign."}`;
        return {
          id: `${platform}-${Date.now()}`,
          platform,
          platformLabel: platforms.find(p => p.value === platform)?.label || platform,
          icon: platforms.find(p => p.value === platform)?.icon || "📝",
          tone,
          targetAudience,
          content: await fetchAIContent(prompt),
          variations: [],
          metrics: {
            readability: Math.floor(Math.random() * 20) + 80,
            engagement: Math.floor(Math.random() * 30) + 70,
            clarity: Math.floor(Math.random() * 25) + 75,
          },
        };
      };

      const mockCopy = [];
      for (const platform of selectedPlatforms) {
        mockCopy.push(await mockFn(platform));
      }

      setGeneratedCopy(mockCopy);
      onCopyGenerated(mockCopy);

      toast({
        title: "Marketing Copy Generated! 📝",
        description: `Created ${mockCopy.length} platform-specific versions via AI.`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Please try again with different parameters.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const refineCopy = async (copyItem: any) => {
    if (!refinementRequest.trim()) return;
    setIsGenerating(true);
    try {
      const prompt = `Refine the following marketing copy for ${copyItem.platformLabel}: "${copyItem.content}"\nInstruction: ${refinementRequest}`;
      const refinedContent = await fetchAIContent(prompt);

      const updatedCopy = generatedCopy.map(item =>
        item.id === copyItem.id
          ? { ...item, content: refinedContent, refined: true }
          : item
      );

      setGeneratedCopy(updatedCopy);
      setRefinementRequest("");

      toast({
        title: "Copy Refined! ✨",
        description: "Your refinement has been applied successfully via AI.",
      });
    } catch (error) {
      toast({
        title: "Refinement Failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyCopyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied!",
      description: "Copy has been copied to clipboard.",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Generation Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText size={20} />
            Copy Generation Controls
          </CardTitle>
          <CardDescription>
            Create tailored marketing copy for multiple platforms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AICopyGeneratorControls
            targetAudience={targetAudience}
            setTargetAudience={setTargetAudience}
            tone={tone}
            setTone={setTone}
            keyMessages={keyMessages}
            setKeyMessages={setKeyMessages}
            selectedPlatforms={selectedPlatforms}
            togglePlatform={togglePlatform}
            isGenerating={isGenerating}
            onGenerate={generateCopy}
          />
        </CardContent>
      </Card>

      {/* Generated Copy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare size={20} />
            Generated Copy
          </CardTitle>
          <CardDescription>
            Platform-optimized marketing content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AIGeneratedCopyList
            generatedCopy={generatedCopy}
            refinementRequest={refinementRequest}
            setRefinementRequest={setRefinementRequest}
            refineCopy={refineCopy}
            copyCopyToClipboard={copyCopyToClipboard}
          />
        </CardContent>
      </Card>
    </div>
  );
};
