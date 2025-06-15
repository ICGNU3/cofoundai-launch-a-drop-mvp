
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AccentButton } from "@/components/ui/AccentButton";
import { RefreshCw, Sparkles } from "lucide-react";

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
  { value: "twitter", label: "Twitter/X", icon: "🐦" },
  { value: "instagram", label: "Instagram", icon: "📸" },
  { value: "facebook", label: "Facebook", icon: "📘" },
  { value: "linkedin", label: "LinkedIn", icon: "💼" },
  { value: "blog", label: "Blog Post", icon: "📝" },
  { value: "email", label: "Email", icon: "📧" },
  { value: "press", label: "Press Release", icon: "📰" },
  { value: "website", label: "Website Copy", icon: "🌐" },
];

export function AICopyGeneratorControls(props: {
  targetAudience: string;
  setTargetAudience: (x: string) => void;
  tone: string;
  setTone: (x: string) => void;
  keyMessages: string;
  setKeyMessages: (x: string) => void;
  selectedPlatforms: string[];
  togglePlatform: (p: string) => void;
  isGenerating: boolean;
  onGenerate: () => void;
}) {
  return (
    <>
      <div>
        <label className="text-sm font-medium mb-2 block">Target Audience</label>
        <Input
          value={props.targetAudience}
          onChange={(e) => props.setTargetAudience(e.target.value)}
          placeholder="Music lovers, young professionals, creative artists..."
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Tone</label>
        <Select value={props.tone} onValueChange={props.setTone}>
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
          value={props.keyMessages}
          onChange={(e) => props.setKeyMessages(e.target.value)}
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
              variant={props.selectedPlatforms.includes(platform.value) ? "default" : "outline"}
              size="sm"
              onClick={() => props.togglePlatform(platform.value)}
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
        onClick={props.onGenerate}
        disabled={props.isGenerating || props.selectedPlatforms.length === 0}
        className="w-full"
      >
        {props.isGenerating ? (
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
    </>
  );
}

