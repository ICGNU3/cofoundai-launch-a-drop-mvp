
import React from "react";

const logos = [
  {
    name: "Lovable",
    href: "https://lovable.dev",
    img: "/lovable-uploads/65962fb7-394a-4428-be26-846fea14f0ff.png",
    alt: "Lovable logo"
  },
  {
    name: "Zora",
    href: "https://zora.co",
    img: "/lovable-uploads/5c72f153-da39-41fe-bc43-60bcfe0c4faa.png",
    alt: "Zora logo"
  },
  {
    name: "OpenAI",
    href: "https://openai.com",
    img: "/lovable-uploads/538a6b52-4c16-4c36-ab12-1af13a60d234.png",
    alt: "OpenAI logo"
  }
];

const LogoRow: React.FC = () => (
  <div className="flex items-center justify-center gap-8 py-2 mb-2">
    {logos.map((logo) => (
      <a
        key={logo.name}
        href={logo.href}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:scale-105 transition flex items-center"
        aria-label={logo.name}
      >
        <img
          src={logo.img}
          alt={logo.alt}
          className="h-10 w-auto max-w-[120px] object-contain"
          style={{
            background: "transparent",
            borderRadius: 6
          }}
        />
      </a>
    ))}
  </div>
);

export default LogoRow;
