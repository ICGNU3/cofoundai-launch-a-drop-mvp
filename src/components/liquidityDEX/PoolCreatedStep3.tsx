
import React from "react";
import { CheckCircle, ExternalLink, LineChart } from "lucide-react";
import { DEX_URLS } from "./dexConstants";

type Props = {
  tokenSymbol: string;
  tokenAddress: string;
  pairedToken: { symbol: string; address: string };
  dexNetwork: "ethereum" | "polygon" | "base";
  poolAddress?: string;
  liquidityAmount: string;
};

export function PoolCreatedStep3({
  tokenSymbol,
  tokenAddress,
  pairedToken,
  dexNetwork,
  poolAddress,
  liquidityAmount
}: Props) {
  const poolAddr = poolAddress || `${tokenAddress}-${pairedToken.address}-3000`;
  
  return (
    <section className="bg-card border border-border rounded-lg p-6">
      <h2 className="font-bold text-xl mb-4 flex items-center gap-2">
        <CheckCircle size={20} className="text-green-500" />
        {tokenSymbol}/USDC Pool Live!
      </h2>
      
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <CheckCircle size={16} />
          Trading is now enabled for your token
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            className="flex items-center justify-center gap-2 py-3 px-4 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
            href={DEX_URLS[dexNetwork].uniswapTrade(tokenAddress, pairedToken.address)}
          >
            <ExternalLink size={16} />
            Trade on Uniswap
          </a>
          
          <a
            className="flex items-center justify-center gap-2 py-3 px-4 border border-border rounded-md hover:bg-surface transition-colors"
            target="_blank"
            rel="noopener noreferrer"
            href={`https://dexscreener.com/base/${poolAddr}`}
          >
            <LineChart size={16} />
            View Analytics
          </a>
        </div>
      </div>

      <div className="bg-surface border border-border rounded p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <LineChart size={18} />
          Pool Statistics
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-body-text/60">Total Liquidity</div>
            <div className="font-mono">${liquidityAmount || '1,000'}</div>
          </div>
          <div>
            <div className="text-body-text/60">Your Position</div>
            <div className="font-mono">100%</div>
          </div>
          <div>
            <div className="text-body-text/60">24h Volume</div>
            <div className="font-mono">$0</div>
          </div>
          <div>
            <div className="text-body-text/60">Fees Earned</div>
            <div className="font-mono">$0.00</div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-800 text-xs">
        <strong>Next Steps:</strong> Share your token with the community and start building trading volume. 
        Consider adding more liquidity as your project grows.
      </div>
    </section>
  );
}
