
import React, { useRef, useEffect } from "react";

export interface LiveCounterBarProps {
  counter: { total: number; drops: number };
}

const LiveCounterBar: React.FC<LiveCounterBarProps> = ({ counter }) => {
  const countUpDollarRef = useRef<HTMLSpanElement>(null);
  const countUpDropRef = useRef<HTMLSpanElement>(null);

  // Animate counters when value changes (CountUp.js required)
  useEffect(() => {
    // Add CountUp.js if missing
    if (!window.CountUp) {
      const c = document.createElement("script");
      c.src = "https://cdn.jsdelivr.net/npm/countup.js@2.6.2/dist/countUp.min.js";
      c.onload = () => {
        if (window.CountUp) runCounter();
      };
      document.body.appendChild(c);
    } else {
      runCounter();
    }
    function runCounter() {
      // @ts-ignore
      const dollar = new window.CountUp(countUpDollarRef.current, counter.total, { prefix: "$", duration: 1.1, separator: "," });
      // @ts-ignore
      const drops = new window.CountUp(countUpDropRef.current, counter.drops, { duration: 1.0 });
      dollar?.start();
      drops?.start();
    }
  }, [counter]);

  return (
    <div className="flex items-center justify-center w-full mt-5 mb-2 z-10" aria-live="polite">
      <div className="bg-[#242349] px-4 py-1 rounded-sm text-sm font-mono flex gap-2 shadow-lg border border-accent items-center min-w-[300px] justify-center" style={{ letterSpacing: '0.03em' }}>
        <span ref={countUpDollarRef} id="counterDollar" className="tabular-nums font-bold text-gold text-base"></span>
        <span className="text-[#b89cff] mx-1">streamed •</span>
        <span ref={countUpDropRef} id="counterDrop" className="tabular-nums font-bold text-indigo-300 text-base"></span>
        <span className="text-[#b89cff]">drops funded</span>
      </div>
    </div>
  );
};

export default LiveCounterBar;
