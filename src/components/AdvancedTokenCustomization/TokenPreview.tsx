
import React from "react";
type Distribution = {
  team: number; treasury: number; publicSale: number;
};
type Vesting = {
  team: number; early: number;
};
type UtilityType = {
  governance: boolean; access: boolean; staking: boolean; custom: string;
};
type Props = {
  name: string; symbol: string; tokenType: "erc20" | "erc721";
  supply: number;
  mintingType: "fixed" | "inflation" | "deflation";
  inflationRate: number;
  deflationRate: number;
  distribution: Distribution;
  vesting: Vesting;
  utility: UtilityType;
  onBack: () => void;
};
export const TokenPreview: React.FC<Props> = ({
  name, symbol, tokenType, supply, mintingType, inflationRate, deflationRate,
  distribution, vesting, utility, onBack
}) => (
  <div>
    <h2 className="section-heading mb-2">6. Preview &amp; Simulation</h2>
    <div className="bg-card border border-accent/30 rounded-lg p-4 mb-3 shadow">
      <div className="text-tagline text-center mb-2">Here’s a summary of your token configuration:</div>
      <ul className="text-body-text grid gap-1">
        <li><b>Name:</b> {name} &nbsp; <b>Symbol:</b> {symbol}</li>
        <li><b>Standard:</b> {tokenType === "erc20" ? "ERC-20 (Fungible)" : "ERC-721 (NFT)"}</li>
        <li><b>Total Supply:</b> {supply.toLocaleString()}</li>
        {tokenType === "erc20" && (
          <li>
            <b>Supply Model:</b> {mintingType === "fixed" ? "Fixed" : mintingType === "inflation" ? `Inflationary (${inflationRate}%)` : `Deflationary (${deflationRate}%)`}
          </li>
        )}
        <li>
          <b>Distribution:</b> Team {distribution.team}%
          (vests {vesting.team}mo), Treasury {distribution.treasury}%, Public Sale {distribution.publicSale}%
        </li>
        <li>
          <b>Vesting:</b> Team {vesting.team} months, Early Contributors {vesting.early} months
        </li>
        <li>
          <b>Utility:</b>{" "}
          {utility.governance && "Governance, "}
          {utility.access && "Access, "}
          {utility.staking && "Staking, "}
          {utility.custom && utility.custom}
          {!utility.governance && !utility.access && !utility.staking && !utility.custom && <span>None specified</span>}
        </li>
      </ul>
    </div>
    <div className="text-[13px] text-yellow">This is a design simulation. Actual contract features should be audited and follow Zora V4 community standards for security.</div>
    <div className="flex justify-between mt-4">
      <button className="accent-btn secondary" onClick={onBack}>← Back</button>
      <button className="accent-btn" disabled>Mint Token (coming soon)</button>
    </div>
  </div>
);
