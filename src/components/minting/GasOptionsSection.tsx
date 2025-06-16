
import React from "react";

interface GasOptionsSectionProps {
  gasLoading: boolean;
  estNetwork: string;
  gasFees: Record<string, string>;
  gasSpeed: "slow" | "standard" | "fast";
  setGasSpeed: (speed: "slow" | "standard" | "fast") => void;
}

export const GasOptionsSection: React.FC<GasOptionsSectionProps> = ({
  gasLoading,
  estNetwork,
  gasFees,
  gasSpeed,
  setGasSpeed,
}) => {
  if (gasLoading) return <div className="mb-2">Estimating gas fees...</div>;
  
  return (
    <div className="space-y-2 mb-4">
      <div className="font-semibold text-sm">Estimated Gas Fees ({estNetwork}):</div>
      <div className="flex flex-col gap-1">
        {["slow", "standard", "fast"].map((speed) => (
          <label key={speed} className={`cursor-pointer flex items-center gap-2 p-2 rounded border
              ${gasSpeed === speed ? "border-accent bg-accent/10" : "border-border"}
            `}>
            <input
              type="radio"
              name="gasSpeed"
              value={speed}
              checked={gasSpeed === speed}
              onChange={() => setGasSpeed(speed as any)}
              className="accent-accent"
            />
            <span className="capitalize mr-2">{speed}</span>
            <span className="font-mono">
              {gasFees[speed] ? `${gasFees[speed]} ETH` : "-"}
            </span>
            {speed === "fast" && <span className="ml-2 text-xs text-orange-300">(Fastest)</span>}
          </label>
        ))}
      </div>
    </div>
  );
};
