
import React from "react";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";

export function RefinementHistoryList({ refinementHistory }: { refinementHistory: any[] }) {
  return refinementHistory.length > 0 ? (
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
  );
}
