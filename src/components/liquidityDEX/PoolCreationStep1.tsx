
import React from "react";
import { Info } from "lucide-react";

type Props = {
  tokenSymbol: string;
  liquidityAmount: string;
  setLiquidityAmount: (amount: string) => void;
  onNext: () => void;
};

export function PoolCreationStep1({ tokenSymbol, liquidityAmount, setLiquidityAmount, onNext }: Props) {
  return (
    <section className="bg-card border border-border rounded-lg p-6">
      <h2 className="font-bold text-xl mb-4 flex items-center gap-2">
        <Info size={20} /> Create Uniswap V4 Pool
      </h2>
      <p className="mb-4 text-body-text/80">
        Create a liquidity pool for your {tokenSymbol} token to enable trading. This will pair your token with USDC on Uniswap V4.
      </p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Initial Liquidity Amount (USDC)
          </label>
          <input
            type="number"
            value={liquidityAmount}
            onChange={(e) => setLiquidityAmount(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md"
            placeholder="1000"
            min="100"
          />
          <p className="text-xs text-body-text/60 mt-1">
            Minimum 100 USDC recommended for meaningful liquidity
          </p>
        </div>
        
        <button
          className="w-full bg-accent text-white py-3 px-4 rounded-md font-medium hover:bg-accent/90 disabled:opacity-50"
          onClick={onNext}
          disabled={!liquidityAmount || Number(liquidityAmount) < 100}
        >
          Continue to Pool Creation
        </button>
      </div>

      <div className="bg-yellow-100 border-l-4 border-yellow-400 p-3 rounded text-yellow-800 text-xs mt-4">
        <Info size={16} className="inline mr-2" />
        <strong>Note:</strong> Creating a pool requires gas fees and the initial liquidity amount. 
        You'll receive LP tokens representing your pool position.
      </div>
    </section>
  );
}
