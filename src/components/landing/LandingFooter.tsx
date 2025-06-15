
import React from "react";

const LandingFooter = () => (
  <footer className="py-8 border-t border-border bg-[#101910] w-full text-center mt-auto z-[5]">
    <div className="flex flex-col md:flex-row justify-center items-center gap-3 mb-2 text-sm text-tagline font-mono">
      <span>
        100% non-custodial, no-code, free to start.
      </span>
      <a href="https://discord.com/invite/lovable" target="_blank" rel="noopener noreferrer" className="mx-2 hover:text-accent underline">Join Discord</a>
      <a href="https://x.com/lovableai" target="_blank" rel="noopener noreferrer" className="mx-2 hover:text-accent underline">X (Twitter)</a>
      <a href="https://docs.lovable.dev" target="_blank" rel="noopener noreferrer" className="mx-2 hover:text-accent underline">Docs</a>
    </div>
    <div className="text-xs text-body-text/70">Made with ❤️ — Powered by Lovable + Zora, {new Date().getFullYear()}</div>
  </footer>
);

export default LandingFooter;
