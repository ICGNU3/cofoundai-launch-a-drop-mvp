
import React, { useEffect } from "react";

interface CrewSplitSliderDemoProps {
  onConfetti?: () => void;
}

const CrewSplitSliderDemo: React.FC<CrewSplitSliderDemoProps> = ({ onConfetti }) => {
  useEffect(() => {
    if (!window.confetti) {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/canvas-confetti";
      document.body.appendChild(s);
    }
  }, []);

  function handleSliderChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = +e.target.value;
    if (val === 100 && window.confetti) {
      // @ts-ignore
      window.confetti({ particleCount: 60, spread: 55, origin: { y: 0.6 } });
      if (onConfetti) onConfetti();
    }
  }

  return (
    <div className="demo flex items-center gap-4 justify-center mt-6" aria-label="Demo splitting value between artist and producer">
      <label className="text-sm text-gold">Artist</label>
      <input
        type="range"
        id="demoSlider"
        min={0}
        max={100}
        defaultValue={50}
        className="w-48 accent-[#5D5FEF] focus:ring-2 focus:ring-gold"
        onInput={handleSliderChange}
        aria-valuenow={50}
        aria-valuemin={0}
        aria-valuemax={100}
      />
      <label className="text-sm text-indigo-400">Producer</label>
    </div>
  );
};

export default CrewSplitSliderDemo;
