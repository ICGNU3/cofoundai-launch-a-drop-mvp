
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Copy, Edit, Sparkles, Target } from "lucide-react";

export function AIGeneratedCopyList(props: {
  generatedCopy: any[];
  refinementRequest: string;
  setRefinementRequest: (x: string) => void;
  refineCopy: (copyItem: any) => void;
  copyCopyToClipboard: (content: string) => void;
}) {
  return props.generatedCopy.length > 0 ? (
    <div className="space-y-4">
      {props.generatedCopy.map((copyItem) => (
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
              onClick={() => props.copyCopyToClipboard(copyItem.content)}
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
              value={props.refinementRequest}
              onChange={(e) => props.setRefinementRequest(e.target.value)}
              className="flex-1 text-sm"
            />
            <Button
              size="sm"
              onClick={() => props.refineCopy(copyItem)}
              disabled={!props.refinementRequest.trim()}
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
  );
}

