
import React from "react";

export const SoloModeSection: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg">Creator</span>
            <span className="text-green-500 font-mono">100%</span>
          </div>
          <div className="text-sm text-green-500 flex items-center gap-1">
            <span>✓</span>
            <span>Cuts balanced</span>
          </div>
        </div>
        <div className="mt-2 text-sm text-body-text/60">
          Full ownership and control of your project
        </div>
      </div>
    </div>
  );
};
