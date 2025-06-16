
import React, { useState, useEffect } from "react";
import { Info, ExternalLink, LineChart, CheckCircle } from "lucide-react";
import { useUniversalSwap } from "@/hooks/useUniversalSwap";

type Props = {
  tokenSymbol: string;
  tokenAddress: string;
  pairedToken?: { symbol: string; address: string };
  dexNetwork: "ethereum" | "polygon" | "base";
  poolAddress?: string;
  onPoolCreated?: (poolAddress: string) => void;
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
  base: {
    uniswap: (token1: string, token2: string) =>
      `https://app.uniswap.org/?chain=base#/add/v2/${token1}/${token2}`,
    uniswapTrade: (token1: string, token2: string) =>
      `https://app.uniswap.org/?chain=base#/swap?inputCurrency=${token1}&outputCurrency=${token2}`,
  },
};

const defaultPairedToken = {
  symbol: "USDC",
  address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base
};

const LiquidityDEXIntegration: React.FC<Props> = ({
  tokenSymbol,
  tokenAddress,
  pairedToken = defaultPairedToken,
  dexNetwork,
  poolAddress,
  onPoolCreated,
}) => {
  const [step, setStep] = useState(poolAddress ? 3 : 1);
  const [liquidityAmount, setLiquidityAmount] = useState<string>("1000");
  const [isCreatingPool, setIsCreatingPool] = useState(false);
  
  const { createPoolAndAddLiquidity, isLoading, error, txHash, receipt } = useUniversalSwap();

  // Auto-advance to step 3 when pool is created
  useEffect(() => {
    if (poolAddress) {
      setStep(3);
    }
  }, [poolAddress]);

  // Handle successful pool creation
  useEffect(() => {
    if (receipt && isCreatingPool) {
      setIsCreatingPool(false);
      const newPoolAddress = `${tokenAddress}-${pairedToken.address}-3000`;
      onPoolCreated?.(newPoolAddress);
      setStep(3);
    }
  }, [receipt, isCreatingPool, tokenAddress, pairedToken.address, onPoolCreated]);

  const handleCreatePool = async () => {
    if (!liquidityAmount || !tokenAddress) return;
    
    setIsCreatingPool(true);
    try {
      await createPoolAndAddLiquidity({
        tokenA: tokenAddress,
        tokenB: pairedToken.address,
        fee: 3000, // 0.3% fee tier
        initialPrice: "1000000000000000000", // 1:1 ratio
        liquidityAmount
      });
    } catch (error) {
      console.error('Failed to create pool:', error);
      setIsCreatingPool(false);
    }
  };

  if (step === 1) {
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
            onClick={() => setStep(2)}
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

  if (step === 2) {
    return (
      <section className="bg-card border border-border rounded-lg p-6">
        <h2 className="font-bold text-xl mb-4">Create Pool: {tokenSymbol}/USDC</h2>
        
        <div className="space-y-4 mb-6">
          <div className="bg-surface border border-border rounded p-4">
            <h3 className="font-semibold mb-2">Pool Configuration</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Token Pair:</span>
                <span>{tokenSymbol}/USDC</span>
              </div>
              <div className="flex justify-between">
                <span>Fee Tier:</span>
                <span>0.3%</span>
              </div>
              <div className="flex justify-between">
                <span>Initial Liquidity:</span>
                <span>{liquidityAmount} USDC</span>
              </div>
              <div className="flex justify-between">
                <span>Initial Price:</span>
                <span>1 {tokenSymbol} = 1 USDC</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            className="flex-1 bg-accent text-white py-3 px-4 rounded-md font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleCreatePool}
            disabled={isLoading || isCreatingPool}
          >
            {isLoading || isCreatingPool ? 'Creating Pool...' : 'Create Pool'}
          </button>
          <button
            className="px-4 py-3 border border-border rounded-md hover:bg-surface"
            onClick={() => setStep(1)}
            disabled={isLoading || isCreatingPool}
          >
            Back
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
            Error: {error}
          </div>
        )}

        {txHash && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-800 text-sm">
            Transaction submitted: {txHash.slice(0, 10)}...{txHash.slice(-8)}
          </div>
        )}
      </section>
    );
  }

  // Step 3: Pool created successfully
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
};

export default LiquidityDEXIntegration;
