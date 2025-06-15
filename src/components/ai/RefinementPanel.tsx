
import React from "react";
import { Button } from "@/components/ui/button";
import { AccentButton } from "@/components/ui/AccentButton";
import { RefreshCw, Wand2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export function RefinementPanel(props: {
  activeRefiner: string;
  isRefining: boolean;
  aiSuggestions: any[];
  platformOptimizations: any[];
  toneAdjustments: any[];
  applyRefinement: (type: string, value?: string) => void;
  customRefinement: string;
  setCustomRefinement: (x: string) => void;
  applyCustomRefinement: () => void;
}) {
  return (
    <>
      {props.activeRefiner === "suggestions" && (
        <div className="space-y-3">
          {props.aiSuggestions.map((suggestion) => (
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
                onClick={() => props.applyRefinement(suggestion.type)}
                disabled={props.isRefining}
              >
                {suggestion.action}
              </Button>
            </div>
          ))}
        </div>
      )}

      {props.activeRefiner === "optimization" && (
        <div className="space-y-4">
          {props.platformOptimizations.map((platform) => (
            <div key={platform.platform} className="space-y-2">
              <h4 className="font-medium text-sm">{platform.platform}</h4>
              <div className="space-y-1">
                {platform.suggestions.map((suggestion: string, idx: number) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => props.applyRefinement("platform", suggestion)}
                    disabled={props.isRefining}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {props.activeRefiner === "tone" && (
        <div className="space-y-3">
          {props.toneAdjustments.map((tone) => (
            <Button
              key={tone.value}
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => props.applyRefinement("tone", tone.value)}
              disabled={props.isRefining}
            >
              {tone.label}
            </Button>
          ))}
        </div>
      )}

      {props.activeRefiner === "custom" && (
        <div className="space-y-4">
          <Textarea
            value={props.customRefinement}
            onChange={(e) => props.setCustomRefinement(e.target.value)}
            placeholder="Describe the specific changes you want to make..."
            className="min-h-[100px]"
          />
          <AccentButton
            onClick={props.applyCustomRefinement}
            disabled={props.isRefining || !props.customRefinement.trim()}
            className="w-full"
          >
            {props.isRefining ? (
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
    </>
  );
}
