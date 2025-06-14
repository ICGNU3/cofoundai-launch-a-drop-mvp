
import React from "react";

// Page-wide animated SVG gradient waves as a background
const FullWaveBackground: React.FC = () => (
  <div
    aria-hidden
    className="pointer-events-none fixed inset-0 z-0 w-full h-[40vh] min-h-[260px] max-h-[400px] overflow-hidden select-none"
    style={{
      top: 0,
      left: 0,
      right: 0,
      // for edge-to-edge appearance
    }}
  >
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1440 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="wave1" x1="0" y1="0" x2="1440" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9A4DFF" />
          <stop offset="1" stopColor="#5D5FEF" />
        </linearGradient>
        <linearGradient id="wave2" x1="0" y1="400" x2="1440" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5D5FEF" />
          <stop offset="1" stopColor="#9A4DFF" />
        </linearGradient>
      </defs>
      {/* Bottom wave */}
      <path d="M0 320 Q360 250 720 360 T1440 320 V400 H0Z" fill="url(#wave2)">
        <animate attributeName="d" dur="4s" repeatCount="indefinite"
          values="
            M0 320 Q360 250 720 360 T1440 320 V400 H0Z;
            M0 360 Q360 370 720 310 T1440 360 V400 H0Z;
            M0 320 Q360 250 720 360 T1440 320 V400 H0Z
          " />
      </path>
      {/* Top wave */}
      <path d="M0 120 Q360 40 720 190 T1440 120 V320 H0Z" fill="url(#wave1)" fillOpacity={0.83}>
        <animate attributeName="d" dur="4.5s" repeatCount="indefinite"
          values="
            M0 120 Q360 40 720 190 T1440 120 V320 H0Z;
            M0 180 Q360 110 720 100 T1440 180 V320 H0Z;
            M0 120 Q360 40 720 190 T1440 120 V320 H0Z
          " />
      </path>
    </svg>
  </div>
);

export default FullWaveBackground;

