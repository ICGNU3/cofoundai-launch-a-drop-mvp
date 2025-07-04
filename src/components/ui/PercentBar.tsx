
import React from "react";
import { motion } from "framer-motion";

type PercentBarProps = {
  used: number;
  max?: number;
};

export const PercentBar: React.FC<PercentBarProps> = ({ used, max = 100 }) => {
  const percent = Math.min(used, max);
  const remaining = Math.max(max - used, 0);
  
  // Dynamic label logic
  let labelText = "";
  let labelColor = "";
  
  if (used < 100) {
    labelText = `Need ${100 - used}% more`;
    labelColor = "text-red-500";
  } else if (used > 100) {
    labelText = `Remove ${used - 100}%`;
    labelColor = "text-red-500";
  } else {
    labelText = "Percentages balanced ✓";
    labelColor = "text-green-400";
  }
  
  return (
    <div className="w-full mt-2 mb-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-accent">Allocated:</span>
        <span className={`text-xs font-mono ${used > max ? "text-red-500" : "text-accent"}`}>{percent}%</span>
        <span className="text-xs text-muted-foreground">of {max}%</span>
        <span className="text-xs ml-auto font-semibold">{remaining}% left</span>
      </div>
      <div className="w-full bg-gray-800 h-2 rounded overflow-hidden mt-1">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min((used / max) * 100, 100)}%` }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          style={{
            background: used > max ? "#ef4444" : "linear-gradient(90deg, #9A4DFF 0%, #5D5FEF 100%)",
          }}
          className="h-2"
        />
      </div>
      {/* Dynamic label with animated color */}
      <motion.div
        className={`text-sm font-semibold mt-2 ${labelColor}`}
        animate={{ color: labelColor === "text-red-500" ? "#ef4444" : "#4ade80" }}
        transition={{ duration: 0.3 }}
      >
        {labelText}
      </motion.div>
    </div>
  );
};
