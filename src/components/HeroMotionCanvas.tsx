
import React, { useRef, useEffect } from "react";

// GSAP via CDN (global), but we detect and load if missing
const loadGSAP = () =>
  new Promise((resolve) => {
    if (window.gsap) return resolve(window.gsap);
    const script = document.createElement("script");
    script.src = "https://unpkg.com/gsap@3.12.5/dist/gsap.min.js";
    script.onload = () => resolve(window.gsap);
    document.head.appendChild(script);
  });

// Helper for prefers-reduced-motion
const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * HeroMotionCanvas is a fixed SVG overlay.
 * It handles a GSAP timeline per the creative brief.
 */
const HeroMotionCanvas: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const gsapTimeline = useRef<any>(null);

  useEffect(() => {
    let tl: any, gsap: any;
    let cleanup: (() => void) | undefined;

    loadGSAP().then((GSAP) => {
      gsap = GSAP;

      const svg = svgRef.current;
      if (!svg) return;

      // --- SVG Elements ---
      const pulseLine = svg.querySelector("#pulseLine");
      const spark = svg.querySelector("#sparkPath");
      const coin = svg.querySelector("#coinCircle");
      const nodes = Array.from(svg.querySelectorAll(".crew-node"));
      const streamLines = Array.from(svg.querySelectorAll(".stream-line"));

      // Init
      gsap.set([coin, nodes, streamLines], { opacity: 0, scale: 0 });
      gsap.set([pulseLine, spark], { opacity: 0.14 });
      gsap.set(pulseLine, { opacity: 0.13 });
      gsap.set(coin, { filter: "brightness(1)" });
      gsap.set(nodes, { filter: "brightness(1)" });
      gsap.set(spark, { stroke: "var(--accent-start)", strokeDasharray: 120, strokeDashoffset: 120 });
      streamLines.forEach((l: any) => {
        gsap.set(l, {
          strokeDasharray: 70,
          strokeDashoffset: 70,
          opacity: 0,
        });
      });

      // --- Animation Timeline ---
      tl = gsap.timeline({
        paused: false,
        repeat: -1,
        repeatDelay: 0,
        defaults: { ease: "power1.out" },
      });

      // 1. Dormant pulse (subtle)
      tl.to(pulseLine, { opacity: 0.19, duration: 1, yoyo: true, repeat: 1 })
        // 2. Idea spark
        .to(spark, { opacity: 1, strokeDashoffset: 0, stroke: "var(--accent-start)", duration: 1 }, "+=0")
        // 3. Coin mint
        .to(coin, { scale: 1, opacity: 1, duration: 0.85, ease: "back.out(1.8)" }, "-=0.2")
        // 4. Crew nodes
        .to(nodes, { scale: 1, opacity: 1, stagger: 0.12, duration: 0.5, ease: "back.out(2)" }, "-=0.35")
        // 5. Capital streams
        .to(
          streamLines,
          { opacity: 1, strokeDashoffset: 0, duration: 2, ease: "power1.inOut" },
          "-=0.20"
        )
        // 6. Glow
        .to([coin, nodes], { filter: "brightness(1.22)", duration: 0.35 })
        // 7. Reset
        .to(
          [coin, nodes, spark, streamLines],
          { opacity: 0, scale: 0, filter: "brightness(1)", duration: 0.6 },
          "+=0.5"
        )
        // Also hide spark stroke
        .set(spark, { strokeDashoffset: 120 });

      // 10s loop
      tl.duration(10);

      gsapTimeline.current = tl;

      // Prefers-reduced-motion: pause
      if (prefersReducedMotion()) tl.pause();

      // Cleanup
      cleanup = () => tl && tl.kill();
    });

    return () => {
      if (gsapTimeline.current) gsapTimeline.current.kill();
      if (cleanup) cleanup();
    };
  }, []);

  // Responsive SVG size.
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "visible",
      }}
      aria-hidden
      tabIndex={-1}
    >
      {/* Set color tokens inline for the animation */}
      <style>{`
        :root {
          --accent-start: #5D5FEF;
          --accent-end: #9A4DFF;
          --coin: #F5D06C;
          --bg-pulse: #262626;
        }
      `}</style>
      <svg
        ref={svgRef}
        id="sparkCanvas"
        width="100%"
        height="320"
        viewBox="0 0 960 320"
        style={{
          width: "100%",
          height: "320px",
          maxHeight: "32vw",
          minHeight: "220px",
          display: "block",
        }}
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Gradient for streams */}
        <defs>
          <linearGradient id="nodeGradient" x1="40%" y1="60%" x2="60%" y2="0%">
            <stop offset="0%" stopColor="var(--accent-start)" />
            <stop offset="100%" stopColor="var(--accent-end)" />
          </linearGradient>
          <radialGradient
            id="coinGlow"
            cx="50%" cy="50%" r="50%"
            fx="50%" fy="50%"
          >
            <stop offset="0%" stopColor="#fff799" stopOpacity="0.7" />
            <stop offset="100%" stopColor="var(--coin)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Dormant pulse */}
        <rect
          id="pulseLine"
          x="100"
          y="168"
          width="760"
          height="3"
          fill="url(#nodeGradient)"
          rx="1.5"
          opacity="0.14"
        />

        {/* Idea Spark Path */}
        <path
          id="sparkPath"
          d="M480 170 Q500 136, 610 120"
          stroke="var(--accent-start)"
          strokeWidth="4"
          fill="none"
          strokeDasharray="120"
          strokeDashoffset="120"
          opacity="0.20"
        />

        {/* Coin mint (center top, above headline) */}
        <g>
          <circle
            id="coinCircle"
            cx="600"
            cy="120"
            r="22"
            fill="url(#coinGlow)"
            stroke="var(--coin)"
            strokeWidth="5"
            opacity="0"
            style={{
              filter: "drop-shadow(0 0 20px var(--coin))",
            }}
          />
        </g>

        {/* Crew nodes */}
        {(() => {
          const nodes = [];
          const cx = 600,
            cy = 120,
            r = 60;
          for (let i = 0; i < 5; i++) {
            const angle = ((Math.PI * 2) / 5) * i - Math.PI / 2 + 0.28;
            const nx = cx + Math.cos(angle) * r;
            const ny = cy + Math.sin(angle) * r;
            nodes.push(
              <circle
                key={i}
                className="crew-node"
                cx={nx}
                cy={ny}
                r="10"
                fill="var(--accent-end)"
                stroke="var(--accent-start)"
                strokeWidth="3"
                opacity="0"
              />
            );
          }
          return nodes;
        })()}

        {/* Capital stream lines */}
        {(() => {
          const lines = [];
          const cx = 600,
            cy = 120,
            r = 36;
          for (let i = 0; i < 5; i++) {
            const angle = ((Math.PI * 2) / 5) * i - Math.PI / 2 + 0.28;
            const nx = cx + Math.cos(angle) * 60;
            const ny = cy + Math.sin(angle) * 60;
            lines.push(
              <line
                key={i}
                className="stream-line"
                x1={cx}
                y1={cy}
                x2={nx}
                y2={ny}
                stroke="url(#nodeGradient)"
                strokeWidth="3"
                strokeDasharray="70"
                strokeDashoffset="70"
                opacity="0"
              />
            );
          }
          return lines;
        })()}
      </svg>
    </div>
  );
};

export default HeroMotionCanvas;
