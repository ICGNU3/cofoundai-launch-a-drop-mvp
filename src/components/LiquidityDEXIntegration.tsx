
import React, { useState } from "react";
import { Info, ExternalLink, LineChart } from "lucide-react";

type Props = {
  tokenSymbol: string;
  tokenAddress: string;
  pairedToken?: { symbol: string; address: string };
  dexNetwork: "ethereum" | "polygon";
  poolAddress?: string; // Set when pool created or discovered
};

const DEX_URLS = {
  ethereum: {
    uniswap: (token1: string, token2: string) =>
      `https://app.uniswap.org/#/add/v2/${token1}/${token2}`,
    uniswapTrade: (token1: string, token2: string) =>
      `https://app.uniswap.org/#/swap?inputCurrency=${token1}&outputCurrency=${token2}`,
  },
  polygon: {
    uniswap: (token1: string, token2: string) =>
      `https://app.uniswap.org/?chain=polygon#/add/v2/${token1}/${token2}`,
    uniswapTrade: (token1: string, token2: string) =>
      `https://app.uniswap.org/?chain=polygon#/swap?inputCurrency=${token1}&outputCurrency=${token2}`,
  },
};

const defaultPairedToken = {
  symbol: "USDC",
  address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // Ethereum USDC
};

const liquidityRisks = [
  "Impermanent loss can reduce your returns if token prices diverge.",
  "You may lose a portion of your principal due to price volatility.",
  "Providing liquidity exposes you to smart contract and DEX protocol risks.",
];

const LiquidityDEXIntegration: React.FC<Props> = ({
  tokenSymbol,
  tokenAddress,
  pairedToken = defaultPairedToken,
  dexNetwork,
  poolAddress,
}) => {
  // Step state for the guided workflow
  const [step, setStep] = useState(poolAddress ? 3 : 1);
  const [userLiquidity, setUserLiquidity] = useState<number | null>(null); // For future, after wallet connect
  const [mockedFees, setMockedFees] = useState<number>(0.43);

  // Mocked pool address for flow demo if pool created
  const poolAddr =
    poolAddress ||
    "0xD3AdBeefD3AdBeefD3AdBeefD3AdBeefD3AdBeef"; // Demo address

  // 1. User selection/checklist
  if (step === 1) {
    return (
      <section>
        <h2 className="font-bold text-xl mb-2 flex items-center gap-2">
          <Info size={20} /> Launch a Liquidity Pool on Uniswap
        </h2>
        <p className="mb-2">
          To enable trading of your token, you’ll need to provide liquidity—usually by pairing your token with a stablecoin such as USDC.
        </p>
        <ul className="list-disc ml-5 mb-3 text-sm">
          <li>Choose a pair: <b>{tokenSymbol}/USDC</b>.</li>
          <li>Define initial liquidity and allocation for each asset.</li>
          <li>Understand DEX risks (see below).</li>
        </ul>
        <button
          className="accent-btn mb-3"
          onClick={() => setStep(2)}
        >Next: Provide Liquidity</button>

        <div className="bg-yellow-100 border-l-4 border-yellow-400 p-3 rounded text-yellow-800 text-xs flex items-start gap-2 mt-4">
          <Info size={16} /> <div>
            <b>Risks:</b>
            <ul className="ml-3 mt-1 list-disc">
              {liquidityRisks.map(risk => (
                <li key={risk}>{risk}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    );
  }

  // 2. Pool creation
  if (step === 2) {
    const url = DEX_URLS[dexNetwork].uniswap(tokenAddress, pairedToken.address);

    return (
      <section>
        <h2 className="font-bold text-xl mb-2 flex items-center gap-2">Add Liquidity on Uniswap</h2>
        <p className="mb-2">
          Click the link below to open Uniswap and deposit initial liquidity into a new pool for <b>{tokenSymbol}/USDC</b>.
        </p>
        <a
          className="accent-btn mb-2 inline-flex gap-2 items-center"
          target="_blank"
          rel="noopener noreferrer"
          href={url}
        >
          <ExternalLink size={16} /> Open Uniswap – Add Liquidity
        </a>
        <div className="text-xs mb-2">
          Make sure you have both <b>{tokenSymbol}</b> and USDC in your connected wallet, and follow Uniswap’s steps to create the pool and supply funds. Once complete, paste the resulting pool address below to unlock analytics and trading links.
        </div>
        {/* User pastes in their pool address */}
        <div className="flex gap-2 mt-3">
          <input
            type="text"
            placeholder="Uniswap Pool Address"
            className="px-2 py-1 border border-border rounded w-full"
            onChange={e => e.target.value && setStep(3)}
          />
          <button
            className="accent-btn"
            onClick={() => setStep(3)}
          >Continue</button>
        </div>
        <div className="mt-3">
          <button
            className="accent-btn secondary"
            onClick={() => setStep(1)}
          >← Back</button>
        </div>
      </section>
    );
  }

  // 3. Success + analytics/dashboard
  return (
    <section>
      <h2 className="font-bold text-xl mb-2 flex items-center gap-2">
        {tokenSymbol}/USDC Pool Live!
      </h2>
      <div className="mb-3">
        <a
          className="accent-btn inline-flex gap-2 items-center mb-2"
          target="_blank"
          rel="noopener noreferrer"
          href={DEX_URLS[dexNetwork].uniswapTrade(tokenAddress, pairedToken.address)}
        >
          <ExternalLink size={16} /> Trade Now on Uniswap
        </a>
        <div className="text-xs mb-1">
          <a
            href={`https://dexscreener.com/ethereum/${poolAddr}`}
            className="text-accent underline"
            target="_blank"
            rel="noopener noreferrer"
          >View Pool Analytics on DexScreener</a>
        </div>
      </div>
      <div className="flex items-center gap-2 text-green-600 text-sm mb-2">
        <Info size={15} /> Direct trading is now enabled for your token!
      </div>

      {/* Basic LP Analytics (mocked for now, wire up with DEX API in future) */}
      <div className="mt-4 mb-1 font-bold flex items-center gap-2">
        <LineChart size={18} /> LP Position Analytics <span className="text-xs font-normal text-gray-500">(Sampled)</span>
      </div>
      <ul className="text-xs ml-2 mb-2">
        <li>Liquidity Provided: <span className="font-mono">$1,200 (demo)</span></li>
        <li>Total Pool TVL: <span className="font-mono">$15,400 (demo)</span></li>
        <li>Accrued Fees: <span className="font-mono">${mockedFees.toFixed(2)}</span></li>
        <li>Impermanent Loss: <span className="font-mono text-red-500">~0.80%</span></li>
      </ul>
      <div className="bg-card border border-border rounded p-3 text-xs text-body-text/70">
        <div className="mb-1"><b>Next Steps &amp; Best Practices:</b></div>
        <ul className="ml-3 list-disc mb-1">
          <li>Verify your token on <a className="text-accent underline" target="_blank" href="https://app.uniswap.org/token-verify">Uniswap</a> for enhanced visibility.</li>
          <li>Share your Uniswap pool link to bootstrap community liquidity: <span className="break-all">{DEX_URLS[dexNetwork].uniswapTrade(tokenAddress, pairedToken.address)}</span></li>
          <li>Engage on social platforms and DEX aggregators for market visibility.</li>
        </ul>
      </div>
    </section>
  );
};

export default LiquidityDEXIntegration;

