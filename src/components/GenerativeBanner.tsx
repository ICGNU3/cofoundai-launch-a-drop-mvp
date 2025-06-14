
import React from "react";

// Simple animated SVG accent banner (colorful animated waves)
const GenerativeBanner: React.FC = () => (
  <div className="w-full flex justify-center mb-3 animate-fade-in">
    <svg width="320" height="48" viewBox="0 0 320 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wave1" x1="0" y1="0" x2="320" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9A4DFF" />
          <stop offset="1" stopColor="#5D5FEF" />
        </linearGradient>
        <linearGradient id="wave2" x1="0" y1="48" x2="320" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5D5FEF" />
          <stop offset="1" stopColor="#9A4DFF" />
        </linearGradient>
      </defs>
      {/* Bottom wave */}
      <path d="M0 32 Q80 24 160 36 T320 32 V48 H0Z" fill="url(#wave2)">
        <animate attributeName="d" dur="3s" repeatCount="indefinite"
          values="
            M0 32 Q80 24 160 36 T320 32 V48 H0Z;
            M0 36 Q80 40 160 30 T320 36 V48 H0Z;
            M0 32 Q80 24 160 36 T320 32 V48 H0Z
          " />
      </path>
      {/* Top wave */}
      <path d="M0 20 Q80 10 160 24 T320 20 V32 H0Z" fill="url(#wave1)" fillOpacity={0.85}>
        <animate attributeName="d" dur="3.5s" repeatCount="indefinite"
          values="
            M0 20 Q80 10 160 24 T320 20 V32 H0Z;
            M0 26 Q80 18 160 18 T320 26 V32 H0Z;
            M0 20 Q80 10 160 24 T320 20 V32 H0Z
          " />
      </path>
    </svg>
  </div>
);

export default GenerativeBanner;
