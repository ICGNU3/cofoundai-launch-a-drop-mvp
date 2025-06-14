
import React from "react";

type PercentBarProps = {
  used: number;
  max?: number;
};

export const PercentBar: React.FC<PercentBarProps> = ({ used, max = 100 }) => {
  const percent = Math.min(used, max);
  const remaining = Math.max(max - used, 0);
  return (
    <div className="w-full mt-2 mb-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-accent">Allocated:</span>
        <span className={`text-xs font-mono ${used > max ? "text-red-500" : "text-accent"}`}>{percent}%</span>
        <span className="text-xs text-muted-foreground">of {max}%</span>
        <span className="text-xs ml-auto font-semibold">{remaining}% left</span>
      </div>
      <div className="w-full bg-gray-800 h-2 rounded overflow-hidden mt-1">
        <div
          style={{
            width: `${Math.min((used / max) * 100, 100)}%`,
            background: used > max ? "#ef4444" : "#6366f1",
            transition: "width 0.2s"
          }}
          className="h-2"
        />
      </div>
    </div>
  );
};
