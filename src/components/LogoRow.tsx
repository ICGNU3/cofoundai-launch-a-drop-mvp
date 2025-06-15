
import React from "react";

const logos = [
  {
    name: "Lovable",
    href: "https://lovable.dev",
    svg: (
      <svg viewBox="0 0 40 40" width="40" height="40" aria-label="Lovable" fill="none">
        <rect width="40" height="40" rx="8" fill="#9A4DFF"/>
        <text x="20" y="26" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#fff">L</text>
      </svg>
    ),
  },
  {
    name: "Zora",
    href: "https://zora.co",
    svg: (
      <svg viewBox="0 0 40 40" width="40" height="40" aria-label="Zora" fill="none">
        <rect width="40" height="40" rx="8" fill="black"/>
        <text x="20" y="26" textAnchor="middle" fontSize="18" fontFamily="Arial" fontWeight="bold" fill="#fff">Z</text>
      </svg>
    ),
  },
  {
    name: "Placeholder",
    href: "#",
    svg: (
      <svg viewBox="0 0 40 40" width="40" height="40" aria-label="Partner" fill="none">
        <rect width="40" height="40" rx="8" fill="#E0E0E0"/>
        <text x="20" y="26" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#444">DAO</text>
      </svg>
    ),
  },
];

const LogoRow: React.FC = () => (
  <div className="flex items-center justify-center gap-8 py-2 mb-2">
    {logos.map((logo) => (
      <a key={logo.name} href={logo.href} target="_blank" rel="noopener noreferrer" className="hover:scale-105 transition">
        {logo.svg}
      </a>
    ))}
  </div>
);

export default LogoRow;
