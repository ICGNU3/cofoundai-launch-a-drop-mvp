
import React from "react";

type CrewSplitSliderProps = {
  value: number;
  onChange: (val: number) => void;
};

export const CrewSplitSlider: React.FC<CrewSplitSliderProps> = ({ value, onChange }) => {
  // value in [0, 100], snaps to 5%
  const artistPct = 100 - value;
  const producerPct = value;

  return (
    <div className="w-full">
      <label className="block mb-2 text-body-text font-medium">
        Crew &amp; Cut
      </label>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-accent font-bold">{`Artist ${artistPct}%`}</span>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={producerPct}
          onChange={e => onChange(Number(e.target.value))}
          className="flex-1 slider-track accent"
          style={{
            accentColor: "#5D5FEF",
          }}
        />
        <span className="text-accent font-bold">{`Producer ${producerPct}%`}</span>
      </div>
    </div>
  );
};
