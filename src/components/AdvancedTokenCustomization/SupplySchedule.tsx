
import React from "react";
type Props = {
  supply: number;
  onChangeSupply: (v: number) => void;
  mintingType: "fixed" | "inflation" | "deflation";
  onChangeMintingType: (v: "fixed" | "inflation" | "deflation") => void;
  inflationRate: number;
  onChangeInflationRate: (v: number) => void;
  deflationRate: number;
  onChangeDeflationRate: (v: number) => void;
  onNext: () => void;
  onBack: () => void;
  tokenType: "erc20" | "erc721";
};

export const SupplySchedule: React.FC<Props> = ({
  supply, onChangeSupply,
  mintingType, onChangeMintingType,
  inflationRate, onChangeInflationRate,
  deflationRate, onChangeDeflationRate,
  onNext, onBack,
  tokenType,
}) => {
  return (
    <div>
      <h2 className="section-heading mb-2">3. Total Supply &amp; Minting Schedule</h2>
      <div className="text-[15px] mb-2 text-tagline">
        <b>Total Supply:</b> Max number of tokens created. Typically fixed and capped.<br />
        <b>Minting Schedule (ERC-20 only):</b> <span className="text-gold">Fixed Supply</span> is most standard. Advanced: allow tokens to inflate (growth) or deflate (burn).
      </div>
      {tokenType === "erc20" ? (
        <>
          <input
            type="number"
            min={1}
            className="p-2 rounded border border-border bg-card text-body-text w-full mt-2"
            value={supply}
            onChange={e => onChangeSupply(Number(e.target.value))}
            required
            placeholder="Total Supply (e.g., 1,000,000)"
          />
          <div className="flex gap-2 mt-4">
            <label className="flex items-center gap-2">
              <input type="radio" checked={mintingType === "fixed"} onChange={() => onChangeMintingType("fixed")} />
              Fixed Supply
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" checked={mintingType === "inflation"} onChange={() => onChangeMintingType("inflation")} />
              Inflationary
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" checked={mintingType === "deflation"} onChange={() => onChangeMintingType("deflation")} />
              Deflationary
            </label>
          </div>
          {mintingType === "inflation" && (
            <input
              type="number"
              min={0}
              step={0.01}
              className="p-2 rounded border border-border bg-card text-body-text w-full mt-2"
              value={inflationRate}
              onChange={e => onChangeInflationRate(Number(e.target.value))}
              placeholder="Inflation Rate (e.g., 2.5% annual)"
            />
          )}
          {mintingType === "deflation" && (
            <input
              type="number"
              min={0}
              step={0.01}
              className="p-2 rounded border border-border bg-card text-body-text w-full mt-2"
              value={deflationRate}
              onChange={e => onChangeDeflationRate(Number(e.target.value))}
              placeholder="Deflation/Burn Rate (e.g., 1%)"
            />
          )}
        </>
      ) : (
        <>
          <input
            type="number"
            min={1}
            className="p-2 rounded border border-border bg-card text-body-text w-full mt-2"
            value={supply}
            onChange={e => onChangeSupply(Number(e.target.value))}
            required
            placeholder="NFT Edition Size (e.g., 1, 100)"
          />
          <div className="text-sm text-tagline my-2">Edition-size for your NFT (ERC-721): each mint is unique, supply usually equals quantity minted.</div>
        </>
      )}
      <div className="flex justify-between mt-4">
        <button className="accent-btn secondary" onClick={onBack}>← Back</button>
        <button className="accent-btn" type="button" onClick={onNext} disabled={supply < 1}>
          Next: Distribution
        </button>
      </div>
    </div>
  );
};
