
import React from "react";

type Props = {
  name: string;
  symbol: string;
  onChangeName: (v: string) => void;
  onChangeSymbol: (v: string) => void;
  onNext: () => void;
};

export const TokenNaming: React.FC<Props> = ({
  name,
  symbol,
  onChangeName,
  onChangeSymbol,
  onNext,
}) => {
  return (
    <div>
      <h2 className="section-heading mb-2">1. Token Name &amp; Symbol</h2>
      <div className="text-[15px] mb-2 text-tagline">
        <b>Token Name:</b> Should reflect your project or DAO's brand (e.g., <span className="text-gold">OpenDev DAO Token</span>).
        <br />
        <b>Token Symbol:</b> Must be unique (e.g., <span className="text-gold">ODT</span>), 3-6 uppercase letters.
      </div>
      <div className="flex flex-col gap-3 mt-3">
        <input
          className="p-2 rounded border border-border bg-card text-body-text"
          placeholder="Token Name (e.g., OpenDev DAO Token)"
          value={name}
          onChange={e => onChangeName(e.target.value)}
          maxLength={32}
          required
        />
        <input
          className="p-2 rounded border border-border bg-card text-body-text uppercase"
          placeholder="Symbol (e.g., ODT)"
          value={symbol}
          onChange={e => onChangeSymbol(e.target.value.replace(/[^A-Z]/g, '').toUpperCase())}
          maxLength={6}
          required
        />
        <button
          className="accent-btn mt-2"
          type="button"
          onClick={onNext}
          disabled={!name || !symbol || symbol.length < 3}
        >Next: Select Token Type</button>
      </div>
    </div>
  );
};
