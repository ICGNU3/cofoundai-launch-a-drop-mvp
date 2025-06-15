
import React from "react";

type Props = {
  tokenType: "erc20" | "erc721";
  onChange: (v: "erc20" | "erc721") => void;
  onNext: () => void;
  onBack: () => void;
};
export const TokenTypeSelector: React.FC<Props> = ({
  tokenType,
  onChange,
  onNext,
  onBack,
}) => {
  return (
    <div>
      <h2 className="section-heading mb-2">2. Token Standard</h2>
      <div className="text-sm text-tagline mb-3">
        <div className="mb-1">
          <b>ERC-20:</b> Fungible, interchangeable tokens. Best for reward/governance/etc.<br />
          <b>ERC-721:</b> Non-fungible tokens (NFTs). Unique/collectible assets. Best for 1-of-1 drops.
        </div>
        <div>
          <span className="text-gold">Tip:</span> ERC-20 is the classic modular Zora token. ERC-721 fits single artwork/collab drops.
        </div>
      </div>
      <div className="flex gap-3 mb-3">
        <button type="button"
          className={`rounded-lg px-5 py-2 font-semibold border ${tokenType === "erc20" ? "bg-accent text-background border-accent" : "bg-card border-border text-body-text"}`}
          onClick={() => onChange("erc20")}
        >ERC-20</button>
        <button type="button"
          className={`rounded-lg px-5 py-2 font-semibold border ${tokenType === "erc721" ? "bg-accent text-background border-accent" : "bg-card border-border text-body-text"}`}
          onClick={() => onChange("erc721")}
        >ERC-721</button>
      </div>
      <div className="flex justify-between">
        <button className="accent-btn secondary" onClick={onBack}>← Back</button>
        <button className="accent-btn" onClick={onNext}>Next: Token Supply</button>
      </div>
    </div>
  );
};
