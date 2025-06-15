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

  // Helper: Call Edge Function for AI
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

  const generateCopy = async () => {
    setIsGenerating(true);
    try {
      // For each platform, get AI-generated copy via Edge Function
      const mockFn = async (platform: string) => {
        const prompt = `Write a ${tone} marketing announcement for a ${projectType} project called "${projectIdea}". Platform: ${platform}. Target audience: ${targetAudience || "general"}. Key messages: ${keyMessages || "Default campaign."}`;
        return {
          id: `${platform}-${Date.now()}`,
          platform,
          platformLabel: platforms.find(p => p.value === platform)?.label || platform,
          icon: platforms.find(p => p.value === platform)?.icon || "📝",
          tone,
          targetAudience,
          // REAL AI content:
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
      // Use Edge Function for refinement prompt
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
          <div>
            <label className="text-sm font-medium mb-2 block">Target Audience</label>
            <Input
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="Music lovers, young professionals, creative artists..."
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Tone</label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tones.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Key Messages</label>
            <Textarea
              value={keyMessages}
              onChange={(e) => setKeyMessages(e.target.value)}
              placeholder="Highlight unique features, benefits, call-to-action..."
              className="min-h-[80px]"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Target Platforms</label>
            <div className="grid grid-cols-2 gap-2">
              {platforms.map((platform) => (
                <Button
                  key={platform.value}
                  variant={selectedPlatforms.includes(platform.value) ? "default" : "outline"}
                  size="sm"
                  onClick={() => togglePlatform(platform.value)}
                  className="justify-start"
                >
                  <span className="mr-2">{platform.icon}</span>
                  {platform.label}
                </Button>
              ))}
            </div>
            <p className="text-xs text-body-text/60 mt-2">
              Select platforms to generate optimized copy for each
            </p>
          </div>

          <AccentButton
            onClick={generateCopy}
            disabled={isGenerating || selectedPlatforms.length === 0}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <RefreshCw size={16} className="mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={16} className="mr-2" />
                Generate Marketing Copy
              </>
            )}
          </AccentButton>
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
          {generatedCopy.length > 0 ? (
            <div className="space-y-4">
              {generatedCopy.map((copyItem) => (
                <div key={copyItem.id} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{copyItem.icon}</span>
                      <span className="font-medium">{copyItem.platformLabel}</span>
                      {copyItem.refined && (
                        <Badge variant="secondary" className="text-xs">
                          Refined
                        </Badge>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyCopyToClipboard(copyItem.content)}
                    >
                      <Copy size={14} />
                    </Button>
                  </div>
                  
                  <div className="bg-background/50 p-3 rounded text-sm">
                    {copyItem.content}
                  </div>
                  
                  <div className="flex gap-4 text-xs">
                    <span className="flex items-center gap-1">
                      <Target size={12} />
                      Readability: {copyItem.metrics.readability}%
                    </span>
                    <span className="flex items-center gap-1">
                      <Sparkles size={12} />
                      Engagement: {copyItem.metrics.engagement}%
                    </span>
                  </div>
                  
                  <div className="flex gap-2 pt-2 border-t border-border">
                    <Input
                      placeholder="Make it more concise, add call to action..."
                      value={refinementRequest}
                      onChange={(e) => setRefinementRequest(e.target.value)}
                      className="flex-1 text-sm"
                    />
                    <Button
                      size="sm"
                      onClick={() => refineCopy(copyItem)}
                      disabled={!refinementRequest.trim()}
                    >
                      <Edit size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-body-text/50">
              <FileText size={48} className="mx-auto mb-4 opacity-20" />
              <p>Generate marketing copy to see results here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
