
import React, { useRef, useEffect } from "react";

// Utility to load GSAP from CDN if not present
function loadGSAP() {
  return new Promise<any>((resolve) => {
    if ((window as any).gsap) return resolve((window as any).gsap);
    const script = document.createElement("script");
    script.src = "https://unpkg.com/gsap@3.12.5/dist/gsap.min.js";
    script.onload = () => resolve((window as any).gsap);
    document.head.appendChild(script);
  });
}

// Accessibility: detect reduce motion
const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// CSS variables for color tokens
const setCSSVars = () => {
  document.documentElement.style.setProperty("--accent-start", "#5D5FEF");
  document.documentElement.style.setProperty("--accent-end", "#9A4DFF");
  document.documentElement.style.setProperty("--coin", "#F5D06C");
  document.documentElement.style.setProperty("--bg-pulse", "#262626");
};

const CANVAS_HEIGHT = 320;
const CANVAS_MIN_HEIGHT = 220;

const HeroMotionCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timelineRef = useRef<any>(null);

  // Animation parameters: scene geometry
  const cx = 600, cy = 120; // "Scene" native coordinates
  const coinR = 22;
  const nodeCount = 5;
  const nodesR = 60;
  const crewNodeR = 10;
  const streamsR = 60;

  // Helper to remap coords for canvas scaling (responsive)
  function getTransform(canvas: HTMLCanvasElement) {
    const w = canvas.width;
    const h = canvas.height;
    // We use a "native" scene size: 960x320, so scale factors:
    const sx = w / 960;
    const sy = h / 320;
    return { sx, sy };
  }

  // Action: Draw a frame of the animation
  function renderFrame(ctx: CanvasRenderingContext2D, progress: number) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Transform for scaling to viewport
    const { sx, sy } = getTransform(ctx.canvas);

    // Colors from CSS vars
    const accentStart = getComputedStyle(document.documentElement).getPropertyValue("--accent-start") || "#5D5FEF";
    const accentEnd = getComputedStyle(document.documentElement).getPropertyValue("--accent-end") || "#9A4DFF";
    const coinColor = getComputedStyle(document.documentElement).getPropertyValue("--coin") || "#F5D06C";
    const bgPulse = getComputedStyle(document.documentElement).getPropertyValue("--bg-pulse") || "#222";

    // --- TIMELINE: 0→10s keyed by progress [0,1) ---
    // Helper functions to ease value transitions
    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }
    function easeBackOut(t: number, s = 1.7) {
      // "back" out: overshoots a bit, then snaps to 1
      return --t * t * ((s + 1) * t + s) + 1;
    }

    // Sequence percents
    let t = progress % 1;
    // Sequence:
    // t:    [0,0.16)      Pulse
    //       [0.16,0.26)   Spark
    //       [0.26,0.38)   Coin
    //       [0.38,0.54)   Crew
    //       [0.54,0.74)   Streams
    //       [0.74,0.84)   Glow
    //       [0.84,1.00)   Fade/reset

    // --- 1. Dormant Pulse (static BG line with a soft glow) ---
    // Main line
    ctx.save();
    ctx.globalAlpha = 0.14 + 0.07 * Math.sin(t * Math.PI * 2 * 1.2);
    ctx.strokeStyle = accentStart;
    ctx.lineWidth = 8 * sx;
    ctx.beginPath();
    ctx.moveTo(100 * sx, 168 * sy);
    ctx.lineTo(860 * sx, 168 * sy);
    ctx.stroke();
    ctx.restore();

    // --- 2. Idea Spark (curved path, animating "draw on" stroke) ---
    let sparkDraw = 0;
    if (t > 0.16 && t < 0.26) {
      sparkDraw = lerp(0, 1, (t - 0.16) / 0.10);
    } else if (t >= 0.26) {
      sparkDraw = 1;
    }
    ctx.save();
    ctx.globalAlpha = 0.18 + 0.6 * sparkDraw;
    ctx.strokeStyle = accentStart;
    ctx.lineWidth = 4 * sx;
    ctx.setLineDash([130 * sparkDraw, 110]);
    ctx.beginPath();
    // Quadratic curve
    ctx.moveTo(480 * sx, 170 * sy);
    ctx.quadraticCurveTo(500 * sx, 136 * sy, 610 * sx, 120 * sy);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // --- 3. Coin Mint (circle pops in, scaling 0→1) ---
    let coinAppear = 0;
    if (t > 0.26 && t < 0.38) {
      coinAppear = easeBackOut((t - 0.26) / 0.12);
    } else if (t >= 0.38) {
      coinAppear = 1;
    }
    ctx.save();
    ctx.globalAlpha = coinAppear;
    ctx.strokeStyle = coinColor;
    ctx.lineWidth = 6 * sx;
    ctx.beginPath();
    ctx.arc(600 * sx, 120 * sy, coinR * coinAppear * sx, 0, Math.PI * 2);
    ctx.stroke();

    // Glow effect on coin (final stages)
    if (t >= 0.74 && t < 0.84) {
      let glow = lerp(1.0, 1.3, (t - 0.74) / 0.1);
      ctx.shadowColor = coinColor;
      ctx.shadowBlur = 24 * glow * sx;
    }
    ctx.restore();

    // --- 4. Crew nodes (pop in radially) ---
    let nodesAppear = 0;
    if (t > 0.38 && t < 0.54) {
      nodesAppear = lerp(0, 1, (t - 0.38) / 0.16);
    } else if (t >= 0.54) {
      nodesAppear = 1;
    }
    for (let i = 0; i < nodeCount; i++) {
      let angle = ((Math.PI * 2) / nodeCount) * i - Math.PI / 2 + 0.28;
      let nx = 600 + Math.cos(angle) * nodesR;
      let ny = 120 + Math.sin(angle) * nodesR;
      ctx.save();
      ctx.globalAlpha = nodesAppear;
      ctx.strokeStyle = accentStart;
      ctx.lineWidth = 3 * sx;
      ctx.fillStyle = accentEnd;
      ctx.beginPath();
      ctx.arc(nx * sx, ny * sy, crewNodeR * nodesAppear * sx, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // --- 5. Capital streams (lines from coin to each node, animate dash offset) ---
    let streamProgress = 0;
    if (t > 0.54 && t < 0.74) {
      streamProgress = lerp(0, 1, (t - 0.54) / 0.2);
    } else if (t >= 0.74) {
      streamProgress = 1;
    }
    for (let i = 0; i < nodeCount; i++) {
      let angle = ((Math.PI * 2) / nodeCount) * i - Math.PI / 2 + 0.28;
      let nx = 600 + Math.cos(angle) * streamsR;
      let ny = 120 + Math.sin(angle) * streamsR;
      ctx.save();
      // Gradient: create each on-the-fly
      let grad = ctx.createLinearGradient(600 * sx, 120 * sy, nx * sx, ny * sy);
      grad.addColorStop(0, accentStart);
      grad.addColorStop(1, accentEnd);

      ctx.strokeStyle = grad;
      ctx.globalAlpha = streamProgress;
      ctx.lineWidth = 3 * sx;
      ctx.setLineDash([50 * streamProgress, 70 - 50 * streamProgress]);
      ctx.beginPath();
      ctx.moveTo(600 * sx, 120 * sy);
      ctx.lineTo(nx * sx, ny * sy);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    // --- 6. Glow highlight (boost brightness on coin/nodes) ---
    if (t > 0.74 && t < 0.84) {
      let glowAlpha = lerp(0, 0.5, (t - 0.74) / 0.1);
      ctx.save();
      ctx.globalAlpha = glowAlpha;
      ctx.strokeStyle = "#fff799";
      ctx.shadowColor = "#fff799";
      ctx.shadowBlur = 60 * sx;
      ctx.beginPath();
      ctx.arc(600 * sx, 120 * sy, coinR * 1.18 * sx, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // --- 7. Loop reset: fade/out ---
    if (t > 0.84) {
      let fade = 1 - (t - 0.84) / 0.16;
      ctx.save();
      ctx.globalAlpha = Math.max(0, fade);
      // Simple white out on coin/nodes/streams
      ctx.beginPath();
      ctx.arc(600 * sx, 120 * sy, coinR * sx * 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(245, 208, 108, 0.25)";
      ctx.fill();
      ctx.restore();
    }
  }

  // MAIN: Animate using GSAP
  useEffect(() => {
    setCSSVars();
    let running = true;

    // Scale canvas responsively
    function resizeCanvas() {
      const parent = canvasRef.current?.parentElement;
      if (!canvasRef.current || !parent) return;
      // Use 100% width of parent, min/max height
      const w = parent.offsetWidth;
      const h = Math.max(CANVAS_MIN_HEIGHT, Math.min(CANVAS_HEIGHT, Math.round(w * 0.32)));
      canvasRef.current.width = w;
      canvasRef.current.height = h;
      canvasRef.current.style.width = "100%";
      canvasRef.current.style.height = `${h}px`;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let gsap: any = null;
    let anim: any = null;

    loadGSAP().then((GSAP) => {
      if (!canvasRef.current) return;
      gsap = GSAP;
      if (!gsap) return;

      let start = performance.now();
      let paused = prefersReducedMotion();

      // GSAP timeline drives an artificial progress property
      let state = { progress: 0 };
      anim = gsap.to(state, {
        progress: 1,
        repeat: -1,
        duration: 10,
        ease: "linear",
        paused,
        onUpdate: () => {
          if (!running || !canvasRef.current) return;
          let ctx = canvasRef.current.getContext("2d");
          if (!ctx) return;
          renderFrame(ctx, state.progress % 1);
        },
      });

      // Pause timeline on reduce motion
      if (paused) anim.pause();

      timelineRef.current = anim;
    });

    // On tab out, stop running
    function handleVisibility() {
      if (!timelineRef.current) return;
      if (document.hidden) timelineRef.current.pause();
      else if (!prefersReducedMotion()) timelineRef.current.play();
    }
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      running = false;
      if (timelineRef.current) timelineRef.current.kill();
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
    // eslint-disable-next-line
  }, []);

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
      <canvas
        ref={canvasRef}
        id="sparkCanvas"
        style={{
          width: "100%",
          minHeight: `${CANVAS_MIN_HEIGHT}px`,
          height: `${CANVAS_HEIGHT}px`,
          maxHeight: "32vw",
          display: "block",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default HeroMotionCanvas;
